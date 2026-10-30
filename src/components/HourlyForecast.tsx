// ===== components/HourlyForecast.tsx =====
// Horizontally scrollable strip: temperature for each of the next 24 hours.

import type { HourlyPoint } from "../types/weather";
import { formatHour, formatTemp } from "../utils/formatters";
import { getWeatherInfo } from "../utils/weatherCodes";

interface HourlyForecastProps {
  hourly: HourlyPoint[];
}

export default function HourlyForecast({ hourly }: HourlyForecastProps) {
  return (
    <section className="card">
      <h2 className="card-title">Hourly forecast</h2>
      <div className="hourly-strip">
        {hourly.map((hour, index) => (
          <div className="hour" key={hour.time}>
            <span className="hour-time">
              {index === 0 ? "Now" : formatHour(hour.time)}
            </span>
            <span className="hour-icon">
              {getWeatherInfo(hour.weatherCode, hour.isDay).icon}
            </span>
            <span className="hour-temp">{formatTemp(hour.temperature)}</span>
            <span className="hour-rain">💧 {hour.rainChance}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}