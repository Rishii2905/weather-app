// ===== constants/config.ts =====
// All settings in one place. Change values here, not inside the code.

// IMPORTANT: Open-Meteo needs NO API key. Three separate services, three URLs.
export const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
export const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
export const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

// City shown on first load (before the user searches or has a saved city)
export const DEFAULT_CITY = {
  name: "Mumbai",
  country: "India",
  admin1: "Maharashtra",
  latitude: 19.0728,
  longitude: 72.8826,
};

// IMPORTANT: 16 is the maximum days Open-Meteo allows
export const FORECAST_DAYS = 16;

// How many upcoming hours to show in the hourly strip
export const HOURS_TO_SHOW = 24;

// Wait this long after the user stops typing before calling the search API
export const SEARCH_DEBOUNCE_MS = 400;

// Key used to remember the last searched city in the browser
export const LAST_CITY_STORAGE_KEY = "weather-app:last-city";

// Browser storage key for the saved (favourite) cities
export const FAVORITES_STORAGE_KEY = "weather-app:favorites";

// IMPORTANT: stops the favourites row from growing forever
export const MAX_FAVORITES = 8;