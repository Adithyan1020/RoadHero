"use client";

import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useCallback, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 40.7128, // Default to NY, or somewhere generic
  lng: -74.0060,
};

interface MapWrapperProps {
  location: { lat: number; lng: number } | null;
  onLocationSelect?: (lat: number, lng: number) => void;
  readOnly?: boolean;
}

export function MapWrapper({ location, onLocationSelect, readOnly = false }: MapWrapperProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    const bounds = new window.google.maps.LatLngBounds(location || defaultCenter);
    map.fitBounds(bounds);
    // Add a bit of zoom adjust if we just have one point
    const listener = window.google.maps.event.addListener(map, "idle", function() {
      if (map.getZoom()! > 15) map.setZoom(15);
      window.google.maps.event.removeListener(listener);
    });
    setMap(map);
  }, [location]);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (readOnly || !onLocationSelect || !e.latLng) return;
    onLocationSelect(e.latLng.lat(), e.latLng.lng());
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={location || defaultCenter}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={handleMapClick}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
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
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
      Loading map...
    </div>
  );
}
