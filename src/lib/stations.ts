// Nearby petrol pumps and EV charging stations from Google Places (Nearby Search).
// Runs in the browser on top of the Google Maps script the page already loads,
// so it needs "Places API (New)" enabled for NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
//
// Cost: each search makes two Nearby Search calls (fuel + EV). We only ask for
// basic fields (name, location, address) to stay on the cheapest tier, and
// cache results so moving the pin slightly doesn't search again.

export type StationKind = "fuel" | "ev";

export type Station = {
  id: string;
  kind: StationKind;
  name: string;
  lat: number;
  lng: number;
  distance: number; // metres from the search point
  address: string | null;
  mapsUrl: string; // the place's Google Maps page: hours, phone, photos, reviews
};

const FIELDS = ["id", "displayName", "location", "formattedAddress", "googleMapsURI"];

const TYPES: Record<StationKind, string> = {
  fuel: "gas_station",
  ev: "electric_vehicle_charging_station",
};

function distanceMetres(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

async function searchKind(kind: StationKind, lat: number, lng: number, radius: number): Promise<Station[]> {
  const { Place, SearchNearbyRankPreference } = (await google.maps.importLibrary(
    "places"
  )) as google.maps.PlacesLibrary;

  const { places } = await Place.searchNearby({
    fields: FIELDS,
    includedPrimaryTypes: [TYPES[kind]],
    locationRestriction: { center: { lat, lng }, radius },
    maxResultCount: 20, // Google's maximum per call
    rankPreference: SearchNearbyRankPreference.DISTANCE,
  });

  return places.flatMap((p) => {
    if (!p.location) return [];
    const pos = { lat: p.location.lat(), lng: p.location.lng() };
    return [
      {
        id: p.id,
        kind,
        name: p.displayName ?? (kind === "ev" ? "EV charging station" : "Petrol pump"),
        ...pos,
        distance: distanceMetres({ lat, lng }, pos),
        address: p.formattedAddress ?? null,
        mapsUrl: p.googleMapsURI ?? `https://www.google.com/maps/search/?api=1&query=${pos.lat},${pos.lng}&query_place_id=${p.id}`,
      },
    ];
  });
}

const cache = new Map<string, Station[]>();

export async function findStations(lat: number, lng: number, radius: number): Promise<Station[]> {
  // ~100 m grid, so tiny pin moves reuse the last result
  const key = `${lat.toFixed(3)},${lng.toFixed(3)},${radius}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const [fuel, ev] = await Promise.all([
    searchKind("fuel", lat, lng, radius),
    searchKind("ev", lat, lng, radius),
  ]);
  const stations = [...fuel, ...ev].sort((a, b) => a.distance - b.distance);
  cache.set(key, stations);
  return stations;
}
