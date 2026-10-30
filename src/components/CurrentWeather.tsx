// ===== components/CurrentWeather.tsx =====
// The big hero section: favourite button, city, temperature now,
// condition, today's high/low.

import type { City, CurrentConditions, DailyPoint } from "../types/weather";
import { formatTemp, formatTime } from "../utils/formatters";
import { getWeatherInfo } from "../utils/weatherCodes";
import FavoriteButton from "./FavoriteButton";

interface CurrentWeatherProps {
  city: City;
  current: CurrentConditions;
  today: DailyPoint; // daily[0] holds today's max/min
  isFavorite: boolean;
  favoritesFull: boolean;
  onToggleFavorite: () => void;
}

export default function CurrentWeather({
  city,
  current,
  today,
  isFavorite,
  favoritesFull,
  onToggleFavorite,
}: CurrentWeatherProps) {
  const info = getWeatherInfo(current.weatherCode, current.isDay);

  return (
    <section className="card current">
      {/* IMPORTANT: this row puts the favourite button at the top-left */}
      <div className="current-top">
        <FavoriteButton
          isFavorite={isFavorite}
          disabled={favoritesFull && !isFavorite}
          onToggle={onToggleFavorite}
        />
      </div>

      <h1>{city.name}</h1>
      <p className="current-sub">
        {[city.admin1, city.country].filter(Boolean).join(", ")} · Local time{" "}
        {formatTime(current.time)}
      </p>

      <div className="current-icon">{info.icon}</div>
      <p className="current-temp">{formatTemp(current.temperature)}</p>
      <p className="current-label">{info.label}</p>

      <p className="current-range">
        H: {formatTemp(today.tempMax)} &nbsp; L: {formatTemp(today.tempMin)}
      </p>
    </section>
  );
}