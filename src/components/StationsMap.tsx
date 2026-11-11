"use client";

import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import type { Station } from "@/lib/stations";
import type { LatLng } from "@/hooks/useGeolocation";

const containerStyle = { width: "100%", height: "100%" };
const fallbackCenter = { lat: 20.5937, lng: 78.9629 }; // India, zoomed out

// Simple round markers: forest for petrol, lime for EV, so they read at a glance
function dot(fill: string, stroke: string, scale = 8): google.maps.Symbol {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: fill,
    fillOpacity: 1,
    strokeColor: stroke,
    strokeWeight: 2,
    scale,
  };
}

type Props = {
  center: LatLng | null;
  stations: Station[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onPickLocation: (lat: number, lng: number) => void;
};

export function StationsMap({ center, stations, selectedId, onSelect, onPickLocation }: Props) {
  // Same loader id/options as MapWrapper so the Maps script is only loaded once
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Fit the map around you and the results whenever they change
  useEffect(() => {
    if (!map || !center) return;
    if (stations.length === 0) {
      map.panTo(center);
      map.setZoom(14);
      return;
    }
    const bounds = new google.maps.LatLngBounds(center);
    stations.slice(0, 15).forEach((s) => bounds.extend({ lat: s.lat, lng: s.lng }));
    map.fitBounds(bounds, 40);
  }, [map, center, stations]);

  // Bring the selected station into view
  useEffect(() => {
    if (!map || !selectedId) return;
    const s = stations.find((x) => x.id === selectedId);
    if (s) map.panTo({ lat: s.lat, lng: s.lng });
  }, [map, selectedId, stations]);

  if (loadError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-fog p-4 text-center text-sm text-charcoal">
        The map couldn&apos;t load. Check your internet connection and reload the page.
      </div>
    );
  }
  if (!isLoaded) {
    return <div className="flex h-full w-full items-center justify-center bg-fog text-pebble">Loading map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center ?? fallbackCenter}
      zoom={center ? 14 : 4}
      onLoad={setMap}
      onUnmount={() => setMap(null)}
      onClick={(e) => e.latLng && onPickLocation(e.latLng.lat(), e.latLng.lng())}
      options={{ disableDefaultUI: true, zoomControl: true, clickableIcons: false }}
    >
      {center && <Marker position={center} title="You" zIndex={1000} />}
      {stations.map((s) => {
        const selected = s.id === selectedId;
        return (
          <Marker
            key={s.id}
            position={{ lat: s.lat, lng: s.lng }}
            title={s.name}
            onClick={() => onSelect(s.id)}
            zIndex={selected ? 999 : undefined}
            icon={
              s.kind === "ev"
                ? dot("#9fe870", "#163300", selected ? 11 : 8)
                : dot("#163300", "#ffffff", selected ? 11 : 8)
            }
          />
        );
      })}
    </GoogleMap>
  );
}
