// ===== components/DailyForecast.tsx =====
// The 16-day forecast as a HORIZONTAL strip you can scroll sideways.

import type { DailyPoint } from "../types/weather";
import { formatDate, formatDay, formatTemp } from "../utils/formatters";
import { getWeatherInfo } from "../utils/weatherCodes";

interface DailyForecastProps {
  daily: DailyPoint[];
}

export default function DailyForecast({ daily }: DailyForecastProps) {
  return (
    <section className="card">
      <h2 className="card-title">{daily.length}-day forecast</h2>

      {/* IMPORTANT: daily-strip is a flex row with horizontal scrolling.
          Each day is one "day-card" column inside it. */}
      <div className="daily-strip">
        {daily.map((day, index) => (
          <div className="day-card" key={day.date}>
            <span className="day-name">{formatDay(day.date, index)}</span>
            <span className="day-date">{formatDate(day.date)}</span>
            <span className="day-icon">{getWeatherInfo(day.weatherCode).icon}</span>
            <span className="day-high">{formatTemp(day.tempMax)}</span>
            <span className="day-low">{formatTemp(day.tempMin)}</span>
            <span className="day-rain">💧 {day.rainChance}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}