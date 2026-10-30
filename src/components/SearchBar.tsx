// ===== components/SearchBar.tsx =====
// Search box with live city suggestions.

import { useEffect, useState } from "react";
import { searchCities } from "../api/geocodingApi";
import { SEARCH_DEBOUNCE_MS } from "../constants/config";
import type { City } from "../types/weather";

interface SearchBarProps {
  onSelect: (city: City) => void;
}

export default function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");

  // IMPORTANT: results remember WHICH text they were searched for.
  // This way we never call setState synchronously inside the effect.
  const [result, setResult] = useState<{ query: string; cities: City[] } | null>(null);

  const trimmed = query.trim();

  // Only show results that belong to the text currently in the box.
  // null = nothing to show, [] = searched but nothing found
  const suggestions = result && result.query === trimmed ? result.cities : null;

  // IMPORTANT: DEBOUNCE. The API call only happens if the user pauses typing
  // for 400ms. The cleanup cancels the timer and any running request when
  // a new key is pressed.
  useEffect(() => {
    if (trimmed.length < 2) return; // too short, don't call the API

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const cities = await searchCities(trimmed, controller.signal);
        setResult({ query: trimmed, cities });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setResult({ query: trimmed, cities: [] });
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed]);

  function choose(city: City) {
    onSelect(city); // tell App which city was picked
    setQuery("");
    setResult(null);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    // Pressing Enter picks the first suggestion
    if (suggestions && suggestions.length > 0) choose(suggestions[0]);
  }

  return (
    <form className="search" onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a city…"
        aria-label="Search for a city"
      />

      {suggestions !== null && (
        <ul className="suggestions">
          {suggestions.length === 0 && (
            <li className="suggestion-empty">No cities found</li>
          )}
          {suggestions.map((city) => (
            <li key={`${city.latitude}-${city.longitude}`}>
              <button type="button" onClick={() => choose(city)}>
                {city.name}
                <span>
                  {[city.admin1, city.country].filter(Boolean).join(", ")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}