// ===== hooks/useTimeTheme.ts =====
// Converts weather data into a theme name: morning | noon | evening | night.

import type { WeatherData } from "../types/weather";
import { getTimeOfDay, type TimeOfDay } from "../utils/timeOfDay";

export function useTimeTheme(data: WeatherData | null): TimeOfDay {
  if (!data) return "night"; // default look while the first load is happening

  // daily[0] is TODAY, so it has today's sunrise and sunset
  const today = data.daily[0];
  return getTimeOfDay(data.current.time, today.sunrise, today.sunset);
}