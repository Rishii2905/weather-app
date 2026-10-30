// ===== components/DetailsGrid.tsx =====
// The grid of small info cards: feels like, humidity, wind, visibility,
// AQI, rainfall, sunset.

import type { AirQuality, CurrentConditions, DailyPoint } from "../types/weather";
import { getAqiInfo } from "../utils/aqiScale";
import { formatTime } from "../utils/formatters";

interface DetailsGridProps {
  current: CurrentConditions;
  today: DailyPoint;
  airQuality: AirQuality | null;
}

// A small reusable card, used only inside this file
function DetailCard({ title, value, note }: { title: string; value: string; note?: string }) {
  return (
    <div className="card detail">
      <h3 className="card-title">{title}</h3>
      <p className="detail-value">{value}</p>
      {note && <p className="detail-note">{note}</p>}
    </div>
  );
}

export default function DetailsGrid({ current, today, airQuality }: DetailsGridProps) {
  // IMPORTANT: airQuality can be null (AQI request failed) -> show "Unavailable"
  const aqi = airQuality ? getAqiInfo(airQuality.usAqi) : null;

  return (
    <section className="details-grid">
      <DetailCard
        title="Feels like"
        value={`${Math.round(current.feelsLike)}°`}
        note={
          Math.abs(current.feelsLike - current.temperature) < 1
            ? "Similar to the actual temperature"
            : current.feelsLike > current.temperature
            ? "Feels warmer than actual"
            : "Feels cooler than actual"
        }
      />
      <DetailCard title="Humidity" value={`${current.humidity}%`} />
      <DetailCard title="Wind speed" value={`${Math.round(current.windSpeed)} km/h`} />
      <DetailCard title="Visibility" value={`${current.visibilityKm.toFixed(1)} km`} />

      {/* AQI card is custom: it has a coloured category label */}
      <div className="card detail">
        <h3 className="card-title">Air quality (AQI)</h3>
        {airQuality && aqi ? (
          <>
            <p className="detail-value">{airQuality.usAqi}</p>
            <p className="detail-note" style={{ color: aqi.color, fontWeight: 600 }}>
              {aqi.label}
            </p>
            <p className="detail-note">
              PM2.5: {airQuality.pm25.toFixed(0)} · PM10: {airQuality.pm10.toFixed(0)}
            </p>
          </>
        ) : (
          <p className="detail-note">Unavailable right now</p>
        )}
      </div>

      <DetailCard
        title="Rainfall"
        value={`${today.rainSum.toFixed(1)} mm`}
        note={`Today's total · ${today.rainChance}% chance · Now: ${current.precipitation} mm`}
      />
      <DetailCard
        title="Sunset"
        value={formatTime(today.sunset)}
        note={`Sunrise ${formatTime(today.sunrise)}`}
      />
    </section>
  );
}