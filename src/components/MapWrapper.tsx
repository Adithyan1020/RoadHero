"use client";

import { GoogleMap, useJsApiLoader, Marker, Circle } from "@react-google-maps/api";
import { useEffect, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "100%",
};

// Shown before we know where the user is: a zoomed-out view of India
const fallbackCenter = { lat: 20.5937, lng: 78.9629 };
const FALLBACK_ZOOM = 4;
const LOCATED_ZOOM = 16;

interface MapWrapperProps {
  location: { lat: number; lng: number } | null;
  /** Uncertainty of the location in metres; drawn as a circle when it's large */
  accuracy?: number | null;
  onLocationSelect?: (lat: number, lng: number) => void;
  readOnly?: boolean;
}

export function MapWrapper({ location, accuracy = null, onLocationSelect, readOnly = false }: MapWrapperProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const showAccuracyCircle = location !== null && accuracy !== null && accuracy > 50;

  // Move the map whenever the location changes (e.g. after "Locate me").
  // If the location is a rough guess, zoom out to show the whole uncertain area.
  useEffect(() => {
    if (!map || !location) return;
    if (showAccuracyCircle && accuracy) {
      const circle = new google.maps.Circle({ center: location, radius: accuracy });
      const bounds = circle.getBounds();
      if (bounds) {
        map.fitBounds(bounds);
        return;
      }
    }
    map.panTo(location);
    if ((map.getZoom() ?? 0) < LOCATED_ZOOM - 2) map.setZoom(LOCATED_ZOOM);
  }, [map, location, accuracy, showAccuracyCircle]);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (readOnly || !onLocationSelect || !e.latLng) return;
    onLocationSelect(e.latLng.lat(), e.latLng.lng());
  };

  if (loadError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-fog p-4 text-center text-sm text-charcoal">
        The map couldn&apos;t load. Check your internet connection and reload the page.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-fog text-pebble">Loading map...</div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={location ?? fallbackCenter}
      zoom={location ? LOCATED_ZOOM : FALLBACK_ZOOM}
      onLoad={setMap}
      onUnmount={() => setMap(null)}
      onClick={handleMapClick}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        clickableIcons: false,
      }}
    >
      {showAccuracyCircle && location && accuracy && (
        <Circle
          center={location}
          radius={accuracy}
          options={{
            clickable: false,
            strokeColor: "#163300",
            strokeOpacity: 0.5,
            strokeWeight: 1,
            fillColor: "#9fe870",
            fillOpacity: 0.18,
          }}
        />
      )}
      {location && (
        <Marker
          position={location}
          draggable={!readOnly}
          onDragEnd={(e) => {
            if (!readOnly && onLocationSelect && e.latLng) {
              onLocationSelect(e.latLng.lat(), e.latLng.lng());
            }
          }}
        />
      )}
    </GoogleMap>
  );
}
