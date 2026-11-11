"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Navigation } from "lucide-react";
import { cn } from "cn";
import { StationsMap } from "@/components/StationsMap";
import { useGeolocation, formatDistance } from "@/hooks/useGeolocation";
import type { Station } from "@/lib/stations";

type Filter = "all" | "fuel" | "ev";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "fuel", label: "Petrol pumps" },
  { value: "ev", label: "EV charging" },
];

const RADII = [
  { value: 2000, label: "2 km" },
  { value: 5000, label: "5 km" },
  { value: 10000, label: "10 km" },
  { value: 20000, label: "20 km" },
];

export default function StationsPage() {
  const { location, accuracy, error: locationError, isLocating, locate, setManualLocation } = useGeolocation();

  const [filter, setFilter] = useState<Filter>("all");
  const [radius, setRadius] = useState(5000);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const requestId = useRef(0);

  const search = useCallback(async (lat: number, lng: number, r: number) => {
    const id = ++requestId.current; // ignore answers to older searches
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`/api/stations?lat=${lat}&lng=${lng}&radius=${r}`);
      const json = await res.json();
      if (id !== requestId.current) return;
      if (!res.ok || !json.success) throw new Error(json.message ?? "Something went wrong.");
      setStations(json.data);
      setSelectedId(null);
    } catch (err) {
      if (id !== requestId.current) return;
      setFetchError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      if (id === requestId.current) {
        setLoading(false);
        setSearched(true);
      }
    }
  }, []);

  // Search whenever the location or radius changes
  useEffect(() => {
    if (!location) return;
    const t = setTimeout(() => search(location.lat, location.lng, radius), 0);
    return () => clearTimeout(t);
  }, [location, radius, search]);

  const visible = stations.filter((s) => filter === "all" || s.kind === filter);
  const counts = {
    all: stations.length,
    fuel: stations.filter((s) => s.kind === "fuel").length,
    ev: stations.filter((s) => s.kind === "ev").length,
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 md:px-6 md:py-14">
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Fuel &amp; charging nearby</h1>
      <p className="mt-3 max-w-2xl text-lg text-charcoal">
        Petrol pumps and EV charging stations around you, nearest first. Tap the map to search somewhere else.
      </p>

      {/* Controls */}
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
        <button
          type="button"
          onClick={locate}
          disabled={isLocating}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-forest px-5 text-sm font-medium text-forest transition-colors hover:bg-mist disabled:opacity-50"
        >
          <Navigation className="size-4" />
          {isLocating ? "Locating..." : "Locate me"}
        </button>

        <div className="flex rounded-full bg-fog p-1 text-sm font-medium" role="tablist" aria-label="Station type">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              role="tab"
              aria-selected={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-full px-4 py-2 transition-colors",
                filter === f.value ? "bg-lime text-forest" : "text-charcoal hover:text-forest"
              )}
            >
              {f.label}
              {searched && <span className="ml-1.5 text-xs opacity-70">{counts[f.value]}</span>}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-charcoal">
          Within
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="h-10 rounded-[10px] border border-input bg-paper px-3 text-obsidian focus-visible:border-forest focus-visible:outline-none"
          >
            {RADII.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {locationError && <p className="mt-4 rounded-[10px] bg-alarm/10 p-3 text-sm text-alarm">{locationError}</p>}
      {!locationError && accuracy !== null && accuracy > 300 && (
        <p className="mt-4 rounded-[10px] bg-mist p-3 text-sm text-forest">
          Your location is a rough guess (up to {formatDistance(accuracy)} off). If the results look wrong, tap the map
          where you actually are.
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* Map */}
        <div className="h-80 overflow-hidden rounded-[10px] border lg:sticky lg:top-24 lg:h-[560px]">
          <StationsMap
            center={location}
            stations={visible}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onPickLocation={setManualLocation}
          />
        </div>

        {/* Results */}
        <div>
          {!location && !isLocating && (
            <p className="py-10 text-charcoal">Press Locate me, or tap the map, to see what&apos;s near you.</p>
          )}

          {loading && <p className="py-10 text-charcoal">Searching nearby... this can take a few seconds.</p>}

          {!loading && fetchError && (
            <div className="rounded-[10px] bg-alarm/10 p-4 text-sm text-alarm">
              <p>{fetchError}</p>
              {location && (
                <button
                  type="button"
                  onClick={() => search(location.lat, location.lng, radius)}
                  className="mt-2 font-semibold underline underline-offset-4"
                >
                  Try again
                </button>
              )}
            </div>
          )}

          {!loading && !fetchError && searched && visible.length === 0 && (
            <p className="py-10 text-charcoal">
              Nothing found within {formatDistance(radius)}. Try a bigger distance.
            </p>
          )}

          {!loading && !fetchError && visible.length > 0 && (
            <ul className="divide-y divide-fog border-y border-fog">
              {visible.map((s) => (
                <StationRow
                  key={s.id}
                  station={s}
                  selected={s.id === selectedId}
                  onSelect={() => setSelectedId(s.id)}
                />
              ))}
            </ul>
          )}

          <p className="mt-6 text-xs text-muted-foreground">
            Station data © <a href="https://www.openstreetmap.org/copyright" className="underline" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>.
            Details are added by volunteers, so some stations are missing information. Opening hours and availability
            aren&apos;t live.
          </p>
        </div>
      </div>
    </div>
  );
}

function StationRow({ station: s, selected, onSelect }: { station: Station; selected: boolean; onSelect: () => void }) {
  const details = s.kind === "ev" ? s.sockets : s.fuels;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`;

  return (
    <li
      className={cn("cursor-pointer px-3 py-4 transition-colors", selected ? "bg-mist" : "hover:bg-fog/50")}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {s.kind === "ev" ? "EV charging" : "Petrol pump"}
            {s.brand && <> · {s.brand}</>}
          </p>
          <p className="mt-0.5 font-semibold text-obsidian">{s.name}</p>
          {s.address && <p className="mt-0.5 text-sm text-charcoal">{s.address}</p>}
        </div>
        <p className="shrink-0 font-semibold text-forest">{formatDistance(s.distance)}</p>
      </div>

      {(details.length > 0 || s.openingHours || s.capacity || s.fee) && (
        <p className="mt-2 text-sm text-charcoal">
          {[
            details.join(", "),
            s.capacity ? `${s.capacity} vehicle${s.capacity > 1 ? "s" : ""} at a time` : null,
            s.fee === "no" ? "Free" : s.fee === "yes" ? "Paid" : null,
            s.openingHours === "24/7" ? "Open 24 hours" : s.openingHours ? `Hours: ${s.openingHours}` : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      )}

      <div className="mt-3 flex items-center gap-5 text-sm">
        <a
          href={directions}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="font-medium text-forest underline underline-offset-4 hover:no-underline"
        >
          Directions
        </a>
        {s.phone && (
          <a href={`tel:${s.phone}`} onClick={(e) => e.stopPropagation()} className="font-medium text-forest underline underline-offset-4 hover:no-underline">
            Call {s.phone}
          </a>
        )}
      </div>
    </li>
  );
}
