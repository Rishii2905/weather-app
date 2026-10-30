// ===== hooks/useWeather.ts =====
// Connects React to the API layer. Gives components three things:
// data, loading, error (plus a retry button).

import { useEffect, useState } from "react";
import { getWeather } from "../api/weatherService";
import type { City, WeatherData } from "../types/weather";

// IMPORTANT: each result remembers WHICH request it belongs to.
// "loading" is then derived: no result for the current request = still loading.
interface Result {
  requestId: string;
  data: WeatherData | null;
  error: string | null;
}

export function useWeather(city: City) {
  const [result, setResult] = useState<Result | null>(null);
  const [reloadKey, setReloadKey] = useState(0); // bump this to re-fetch

  // Identifies the current request (city + retry count)
  const requestId = `${city.latitude},${city.longitude}#${reloadKey}`;

  // IMPORTANT: THIS is what triggers the API. It runs on first load, and
  // again whenever the city changes or the user presses Retry.
  useEffect(() => {
    const controller = new AbortController();

    getWeather(city, controller.signal)
      .then((data) => setResult({ requestId, data, error: null }))
      .catch((err: unknown) => {
        // IMPORTANT: ignore AbortError. It means we cancelled an old
        // request on purpose because a newer one started.
        if (err instanceof DOMException && err.name === "AbortError") return;
        setResult({
          requestId,
          data: null,
          error:
            err instanceof Error
              ? err.message
              : "Something went wrong. Check your internet connection.",
        });
      });

    return () => controller.abort(); // cancel if the city changes again
  }, [city, requestId]);

  // Only trust a result that belongs to the current request
  const current = result?.requestId === requestId ? result : null;

  return {
    data: current?.data ?? null,
    error: current?.error ?? null,
    loading: current === null,
    retry: () => setReloadKey((k) => k + 1),
  };
}