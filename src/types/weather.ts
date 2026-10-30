// ===== types/weather.ts =====
// TypeScript shapes of our data. Gives autocomplete and catches typos.

// ---------- Our own clean shapes (what components use) ----------

export interface City {
    name: string;
    country: string;
    admin1?: string; // state/region, e.g. "Gujarat"
    latitude: number;
    longitude: number;
  }
  
  export interface CurrentConditions {
    time: string; // IMPORTANT: city's LOCAL time, e.g. "2026-10-30T16:15"
    temperature: number; // °C
    feelsLike: number; // °C
    humidity: number; // %
    windSpeed: number; // km/h
    precipitation: number; // mm (rain right now)
    visibilityKm: number; // converted from metres
    weatherCode: number; // WMO code, see utils/weatherCodes.ts
    isDay: boolean;
  }
  
  export interface HourlyPoint {
    time: string; // "2026-10-30T17:00"
    temperature: number;
    rainChance: number; // %
    weatherCode: number;
    isDay: boolean;
  }
  
  export interface DailyPoint {
    date: string; // "2026-10-30"
    tempMax: number;
    tempMin: number;
    sunrise: string; // "2026-10-30T06:45"
    sunset: string;
    rainSum: number; // total mm for the day
    rainChance: number; // max % for the day
    weatherCode: number;
  }
  
  export interface AirQuality {
    usAqi: number;
    pm25: number;
    pm10: number;
  }
  
  // The one merged object the whole UI works with
  export interface WeatherData {
    city: City;
    timezone: string;
    current: CurrentConditions;
    hourly: HourlyPoint[];
    daily: DailyPoint[];
    airQuality: AirQuality | null; // null = AQI request failed, weather still works
  }
  
  // ---------- Raw API response shapes (what Open-Meteo sends back) ----------
  
  export interface GeocodingResponse {
    results?: Array<{
      id: number;
      name: string;
      latitude: number;
      longitude: number;
      country?: string;
      admin1?: string;
    }>;
  }
  
  export interface ForecastResponse {
    timezone: string;
    current: {
      time: string;
      temperature_2m: number;
      relative_humidity_2m: number;
      apparent_temperature: number;
      is_day: number; // 1 or 0
      precipitation: number;
      weather_code: number;
      wind_speed_10m: number;
      visibility: number; // metres
    };
    hourly: {
      time: string[];
      temperature_2m: number[];
      precipitation_probability: (number | null)[]; // IMPORTANT: can be null
      weather_code: number[];
      is_day: number[];
    };
    daily: {
      time: string[];
      weather_code: number[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
      sunrise: string[];
      sunset: string[];
      precipitation_sum: (number | null)[];
      precipitation_probability_max: (number | null)[];
    };
  }
  
  export interface AirQualityResponse {
    current: {
      us_aqi: number | null;
      pm2_5: number | null;
      pm10: number | null;
    };
  }