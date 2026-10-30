// ===== api/forecastApi.ts =====
// Fetches weather data: current + hourly + daily. ONE request for all three.

import { FORECAST_DAYS, FORECAST_URL } from "../constants/config";
import type { ForecastResponse } from "../types/weather";

export async function fetchForecast(
  latitude: number,
  longitude: number,
  signal?: AbortSignal
): Promise<ForecastResponse> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),

    // Right-now values
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature", // "feels like"
      "is_day",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
      "visibility",
    ].join(","),

    // Hour-by-hour values
    hourly: [
      "temperature_2m",
      "precipitation_probability",
      "weather_code",
      "is_day",
    ].join(","),

    // Day-by-day values
    daily: [
      "weather_code",
      "temperature_2m_max", // highest of the day
      "temperature_2m_min", // lowest of the day
      "sunrise",
      "sunset",
      "precipitation_sum",
      "precipitation_probability_max",
    ].join(","),

    // IMPORTANT: "auto" makes all times come back in the CITY's local time,
    // not your computer's. The time-based theme depends on this.
    timezone: "auto",

    forecast_days: String(FORECAST_DAYS),
  });

  const response = await fetch(`${FORECAST_URL}?${params}`, { signal });
  if (!response.ok) throw new Error("Could not load the weather forecast.");

  return response.json();
}