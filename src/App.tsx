// ===== App.tsx =====
// The conductor: holds the selected city, triggers data loading,
// applies the theme, manages favourites, and arranges the components.

import { useEffect, useState } from "react";
import CurrentWeather from "./components/CurrentWeather";
import DailyForecast from "./components/DailyForecast";
import DetailsGrid from "./components/DetailsGrid";
import FavoritesBar from "./components/FavoritesBar";
import HourlyForecast from "./components/HourlyForecast";
import SearchBar from "./components/SearchBar";
import StatusMessage from "./components/StatusMessage";
import { DEFAULT_CITY, LAST_CITY_STORAGE_KEY } from "./constants/config";
import { useFavorites } from "./hooks/useFavorites";
import { useTimeTheme } from "./hooks/useTimeTheme";
import { useWeather } from "./hooks/useWeather";
import type { City } from "./types/weather";
import { isSameCity } from "./utils/isSameCity";

// Use the last city the user viewed, or fall back to the default city
function loadSavedCity(): City {
  try {
    const saved = localStorage.getItem(LAST_CITY_STORAGE_KEY);
    if (saved) return JSON.parse(saved) as City;
  } catch {
    // localStorage blocked or data corrupted -> just use default
  }
  return DEFAULT_CITY;
}

export default function App() {
  // IMPORTANT: `city` is the ONE piece of state that drives the weather.
  // Change it -> useWeather re-fetches -> the whole screen updates.
  const [city, setCity] = useState<City>(loadSavedCity);

  const { data, loading, error, retry } = useWeather(city);
  const theme = useTimeTheme(data);
  const { favorites, isFavorite, isFull, toggleFavorite, removeFavorite } =
    useFavorites();

  // IMPORTANT: this line applies the theme. It writes data-theme="evening"
  // (etc.) on <html>, which activates the matching block in themes.css.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Used by BOTH the search dropdown and the favourites chips
  function handleSelectCity(selected: City) {
    // Clicking the city that's already open shouldn't re-fetch for nothing
    if (isSameCity(selected, city)) return;

    setCity(selected); // triggers a new weather fetch
    try {
      localStorage.setItem(LAST_CITY_STORAGE_KEY, JSON.stringify(selected));
    } catch {
      // ignore: remembering the city is just a convenience
    }
  }

  return (
    <main className="app">
      <SearchBar onSelect={handleSelectCity} />

      <FavoritesBar
        favorites={favorites}
        activeCity={city}
        onSelect={handleSelectCity}
        onRemove={removeFavorite}
      />

      {loading && <StatusMessage type="loading" />}

      {!loading && error && (
        <StatusMessage type="error" message={error} onRetry={retry} />
      )}

      {!loading && !error && data && (
        <>
          <CurrentWeather
            city={data.city}
            current={data.current}
            today={data.daily[0]}
            isFavorite={isFavorite(data.city)}
            favoritesFull={isFull}
            onToggleFavorite={() => toggleFavorite(data.city)}
          />
          <HourlyForecast hourly={data.hourly} />
          <DetailsGrid
            current={data.current}
            today={data.daily[0]}
            airQuality={data.airQuality}
          />
          <DailyForecast daily={data.daily} />
        </>
      )}
    </main>
  );
}