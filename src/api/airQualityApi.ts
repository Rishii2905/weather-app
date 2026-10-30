// ===== api/airQualityApi.ts =====
// Fetches air quality (AQI) for a location. It's a SEPARATE API from the forecast.

import { AIR_QUALITY_URL } from "../constants/config";
import type { AirQualityResponse } from "../types/weather";

export async function fetchAirQuality(
  latitude: number,
  longitude: number,
  signal?: AbortSignal
): Promise<AirQualityResponse> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "us_aqi,pm2_5,pm10", // IMPORTANT: us_aqi is the 0-500 scale
    timezone: "auto",
  });

  const response = await fetch(`${AIR_QUALITY_URL}?${params}`, { signal });
  if (!response.ok) throw new Error("Could not load air quality.");

  return response.json();
}