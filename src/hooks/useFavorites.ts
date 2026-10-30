// ===== hooks/useFavorites.ts =====
// Keeps the list of favourite cities and saves it in the browser.

import { useState } from "react";
import { FAVORITES_STORAGE_KEY, MAX_FAVORITES } from "../constants/config";
import type { City } from "../types/weather";
import { isSameCity } from "../utils/isSameCity";

function loadFavorites(): City[] {
  try {
    const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    // IMPORTANT: never trust saved data blindly. Keep only entries that
    // really look like a City, in case the storage was edited or corrupted.
    return parsed.filter(
      (item): item is City =>
        typeof item?.name === "string" &&
        typeof item?.latitude === "number" &&
        typeof item?.longitude === "number"
    );
  } catch {
    return []; // storage blocked or invalid JSON -> start with an empty list
  }
}

export function useFavorites() {
  // IMPORTANT: passing the function (not its result) means it runs only
  // ONCE, on the first render, instead of reading storage on every render.
  const [favorites, setFavorites] = useState<City[]>(loadFavorites);

  // Update the screen AND the browser storage together
  function saveFavorites(next: City[]) {
    setFavorites(next);
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore: favourites still work for this visit, they just won't persist
    }
  }

  const isFavorite = (city: City) => favorites.some((f) => isSameCity(f, city));
  const isFull = favorites.length >= MAX_FAVORITES;

  // Add the city if it's not saved yet, otherwise remove it
  function toggleFavorite(city: City) {
    if (isFavorite(city)) {
      saveFavorites(favorites.filter((f) => !isSameCity(f, city)));
    } else if (!isFull) {
      saveFavorites([...favorites, city]);
    }
  }

  function removeFavorite(city: City) {
    saveFavorites(favorites.filter((f) => !isSameCity(f, city)));
  }

  return { favorites, isFavorite, isFull, toggleFavorite, removeFavorite };
}