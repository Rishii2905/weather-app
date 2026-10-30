// ===== api/weatherService.ts =====
// The "manager" of the api folder: calls both APIs together, merges the
// answers, and converts raw API data into our clean WeatherData shape.

import { HOURS_TO_SHOW } from "../constants/config";
import type { AirQuality, City, WeatherData } from "../types/weather";
import { fetchAirQuality } from "./airQualityApi";
import { fetchForecast } from "./forecastApi";

export async function getWeather(
  city: City,
  signal?: AbortSignal
): Promise<WeatherData> {
  // IMPORTANT: Promise.allSettled starts BOTH requests at the same time
  // (faster than one after another) and waits for both to finish, even if
  // one of them fails.
  const [forecastResult, airResult] = await Promise.allSettled([
    fetchForecast(city.latitude, city.longitude, signal),
    fetchAirQuality(city.latitude, city.longitude, signal),
  ]);

  // IMPORTANT: forecast is essential -> if it fails, the whole thing fails.
  if (forecastResult.status === "rejected") throw forecastResult.reason;
  const f = forecastResult.value;

  // IMPORTANT: AQI is optional -> if it fails (or is empty), show weather
  // anyway and let the UI display "unavailable".
  let airQuality: AirQuality | null = null;
  if (airResult.status === "fulfilled") {
    const c = airResult.value.current;
    if (c.us_aqi !== null) {
      airQuality = { usAqi: c.us_aqi, pm25: c.pm2_5 ?? 0, pm10: c.pm10 ?? 0 };
    }
  }

  // The hourly arrays cover all 16 days. Find where "now" is and keep the
  // next 24 hours. current.time looks like "2026-10-30T16:15", so its first
  // 13 characters ("2026-10-30T16") identify the current hour.
  const currentHour = f.current.time.slice(0, 13);
  let start = f.hourly.time.findIndex((t) => t.slice(0, 13) >= currentHour);
  if (start === -1) start = 0;

  const hourly = f.hourly.time
    .slice(start, start + HOURS_TO_SHOW)
    .map((time, i) => {
      const idx = start + i;
      return {
        time,
        temperature: f.hourly.temperature_2m[idx],
        rainChance: f.hourly.precipitation_probability[idx] ?? 0,
        weatherCode: f.hourly.weather_code[idx],
        isDay: f.hourly.is_day[idx] === 1,
      };
    });

  const daily = f.daily.time.map((date, i) => ({
    date,
    tempMax: f.daily.temperature_2m_max[i],
    tempMin: f.daily.temperature_2m_min[i],
    sunrise: f.daily.sunrise[i],
    sunset: f.daily.sunset[i],
    rainSum: f.daily.precipitation_sum[i] ?? 0,
    rainChance: f.daily.precipitation_probability_max[i] ?? 0,
    weatherCode: f.daily.weather_code[i],
  }));

  return {
    city,
    timezone: f.timezone,
    current: {
      time: f.current.time,
      temperature: f.current.temperature_2m,
      feelsLike: f.current.apparent_temperature,
      humidity: f.current.relative_humidity_2m,
      windSpeed: f.current.wind_speed_10m,
      precipitation: f.current.precipitation,
      visibilityKm: f.current.visibility / 1000, // API gives metres
      weatherCode: f.current.weather_code,
      isDay: f.current.is_day === 1,
    },
    hourly,
    daily,
    airQuality,
  };
}