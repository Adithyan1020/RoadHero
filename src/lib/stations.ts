// Nearby petrol pumps and EV charging stations, from OpenStreetMap via the
// free Overpass API (no key, no billing). Coverage depends on what local
// mappers have added, so some stations have full details and some only a pin.

export type StationKind = "fuel" | "ev";

export type Station = {
  id: string;
  kind: StationKind;
  name: string;
  brand: string | null;
  lat: number;
  lng: number;
  distance: number; // metres from the search point
  address: string | null;
  openingHours: string | null;
  phone: string | null;
  fuels: string[]; // fuel stations: e.g. ["Petrol", "Diesel", "CNG"]
  sockets: string[]; // EV: e.g. ["CCS2 ×2", "Type 2"]
  capacity: number | null; // EV: how many vehicles can charge at once
  fee: string | null; // EV: "yes" / "no" / free text
};

// Public Overpass servers. They're free and run by volunteers, so they're
// sometimes overloaded (502/504) or down; we try the main one twice, then a mirror.
const OVERPASS_MAIN = "https://overpass-api.de/api/interpreter";
const OVERPASS_MIRROR = "https://overpass.private.coffee/api/interpreter";
const ATTEMPTS: { url: string; timeoutMs: number; waitBeforeMs: number }[] = [
  { url: OVERPASS_MAIN, timeoutMs: 20000, waitBeforeMs: 0 },
  { url: OVERPASS_MAIN, timeoutMs: 20000, waitBeforeMs: 1500 },
  { url: OVERPASS_MIRROR, timeoutMs: 15000, waitBeforeMs: 0 },
];

// Overpass asks clients to identify themselves
const USER_AGENT = "RoadRescue/0.1 (roadside assistance app)";

type OsmElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

const FUEL_TAGS: [string, string][] = [
  ["fuel:octane_91", "Petrol"],
  ["fuel:octane_95", "Petrol (premium)"],
  ["fuel:diesel", "Diesel"],
  ["fuel:cng", "CNG"],
  ["fuel:lpg", "Auto LPG"],
  ["fuel:electricity", "EV charging"],
];

const SOCKET_TAGS: [string, string][] = [
  ["socket:type2_combo", "CCS2"],
  ["socket:ccs", "CCS"],
  ["socket:chademo", "CHAdeMO"],
  ["socket:type2", "Type 2"],
  ["socket:type2_cable", "Type 2 (tethered)"],
  ["socket:gb_t_dc", "GB/T DC"],
  ["socket:bharat_ac001", "Bharat AC-001"],
  ["socket:bharat_dc001", "Bharat DC-001"],
  ["socket:type1", "Type 1"],
  ["socket:tesla_supercharger", "Tesla"],
  ["socket:indian_3pin", "3-pin plug"],
  ["socket:schuko", "Domestic socket"],
];

function distanceMetres(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function buildAddress(t: Record<string, string>) {
  const street = [t["addr:housenumber"], t["addr:street"]].filter(Boolean).join(" ");
  const parts = [street, t["addr:suburb"] ?? t["addr:place"], t["addr:city"]].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

function normalise(el: OsmElement, origin: { lat: number; lng: number }): Station | null {
  const t = el.tags ?? {};
  const lat = el.lat ?? el.center?.lat;
  const lng = el.lon ?? el.center?.lon;
  if (lat === undefined || lng === undefined) return null;

  const kind: StationKind = t.amenity === "charging_station" ? "ev" : "fuel";
  const brand = t.brand ?? t.operator ?? null;
  const name = t.name ?? brand ?? (kind === "ev" ? "EV charging station" : "Petrol pump");

  const fuels = FUEL_TAGS.filter(([tag]) => t[tag] === "yes").map(([, label]) => label);
  const sockets = SOCKET_TAGS.filter(([tag]) => t[tag] && t[tag] !== "no").map(([tag, label]) => {
    const count = Number(t[tag]);
    return Number.isFinite(count) && count > 1 ? `${label} ×${count}` : label;
  });
  const capacity = Number(t.capacity);

  return {
    id: `${el.type}/${el.id}`,
    kind,
    name,
    brand: brand && brand !== name ? brand : null,
    lat,
    lng,
    distance: distanceMetres(origin, { lat, lng }),
    address: buildAddress(t),
    openingHours: t.opening_hours ?? null,
    phone: t.phone ?? t["contact:phone"] ?? null,
    fuels,
    sockets,
    capacity: Number.isFinite(capacity) && capacity > 0 ? capacity : null,
    fee: t.fee ?? null,
  };
}

// Small in-memory cache so moving the pin a little, or several people in the
// same area, doesn't hammer the free Overpass servers.
const cache = new Map<string, { at: number; elements: OsmElement[] }>();
const CACHE_MS = 10 * 60 * 1000;

async function queryOverpass(lat: number, lng: number, radius: number): Promise<OsmElement[]> {
  const key = `${lat.toFixed(3)},${lng.toFixed(3)},${radius}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.elements;

  const query = `[out:json][timeout:25];
(
  nwr["amenity"="fuel"](around:${radius},${lat},${lng});
  nwr["amenity"="charging_station"](around:${radius},${lat},${lng});
);
out center tags;`;

  let lastError: unknown;
  for (const { url, timeoutMs, waitBeforeMs } of ATTEMPTS) {
    if (waitBeforeMs) await new Promise((r) => setTimeout(r, waitBeforeMs));
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": USER_AGENT },
        body: new URLSearchParams({ data: query }),
        signal: AbortSignal.timeout(timeoutMs),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Overpass ${url} returned ${res.status}`);
      const json = (await res.json()) as { elements?: OsmElement[] };
      const elements = json.elements ?? [];
      cache.set(key, { at: Date.now(), elements });
      if (cache.size > 500) cache.delete(cache.keys().next().value!);
      return elements;
    } catch (err) {
      lastError = err;
      console.warn("[stations] Overpass request failed:", err instanceof Error ? err.message : err);
    }
  }
  throw lastError;
}

export async function findStations(lat: number, lng: number, radius: number): Promise<Station[]> {
  const elements = await queryOverpass(lat, lng, radius);
  const origin = { lat, lng };

  const seen = new Set<string>();
  const stations: Station[] = [];
  for (const el of elements) {
    const s = normalise(el, origin);
    if (!s) continue;
    // OSM sometimes has several chargers mapped at the exact same spot; show one row
    const dedupeKey = `${s.kind}:${s.lat.toFixed(5)},${s.lng.toFixed(5)}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    stations.push(s);
  }
  return stations.sort((a, b) => a.distance - b.distance);
}
