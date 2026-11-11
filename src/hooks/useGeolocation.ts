"use client";

import { useCallback, useEffect, useState } from "react";

export type LatLng = { lat: number; lng: number };

/**
 * Browser geolocation with honest error messages.
 * - `accuracy` is how far off the reading might be, in metres. Laptops without
 *   GPS guess from Wi-Fi/IP and can be kilometres out; phones with GPS are close.
 * - `setManualLocation` is for when the user taps the map or drags the pin,
 *   which we treat as exact.
 */
export function useGeolocation({ locateOnMount = true } = {}) {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const locate = useCallback(() => {
    setError(null);

    // Browsers only allow location on https:// or http://localhost.
    // Opening the dev server from a phone via http://192.168.x.x is blocked.
    if (!window.isSecureContext) {
      setError(
        "Your browser blocks location on this address. Open the site on https:// or http://localhost, or tap the map to place your pin."
      );
      return;
    }
    if (!("geolocation" in navigator)) {
      setError("This browser can't share your location. Tap the map to place your pin.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setAccuracy(position.coords.accuracy);
        setIsLocating(false);
      },
      (err) => {
        console.error("Error getting location:", err);
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError(
            "Location permission is blocked. Click the icon at the left of the address bar, allow Location, then press Locate me again. Or tap the map to place your pin."
          );
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError(
            "Your device couldn't work out where you are. On Windows, check Settings → Privacy & security → Location is on. Or tap the map to place your pin."
          );
        } else {
          setError("Finding your location took too long. Try again, or tap the map to place your pin.");
        }
      },
      // maximumAge 0: always ask for a fresh reading, never a cached one
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  }, []);

  const setManualLocation = useCallback((lat: number, lng: number) => {
    setLocation({ lat, lng });
    setAccuracy(null); // placed by hand, so treat as exact
    setError(null);
  }, []);

  // Try once when the page opens
  useEffect(() => {
    if (!locateOnMount) return;
    const id = setTimeout(locate, 0);
    return () => clearTimeout(id);
  }, [locate, locateOnMount]);

  return { location, accuracy, error, isLocating, locate, setManualLocation };
}

export function formatDistance(metres: number) {
  return metres >= 1000 ? `${(metres / 1000).toFixed(metres >= 10000 ? 0 : 1)} km` : `${Math.round(metres)} m`;
}
