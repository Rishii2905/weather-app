// ===== components/FavoritesBar.tsx =====
// Row of saved cities. Click a name to view it, click × to remove it.

import type { City } from "../types/weather";
import { isSameCity } from "../utils/isSameCity";

interface FavoritesBarProps {
  favorites: City[];
  activeCity: City; // the city currently on screen (gets highlighted)
  onSelect: (city: City) => void;
  onRemove: (city: City) => void;
}

export default function FavoritesBar({ favorites, activeCity, onSelect, onRemove }: FavoritesBarProps) {
  // Nothing saved yet -> show nothing, keep the page clean
  if (favorites.length === 0) return null;

  return (
    <ul className="favorites-bar" aria-label="Favourite cities">
      {favorites.map((city) => (
        <li
          key={`${city.latitude}-${city.longitude}`}
          className={`favorite-chip${isSameCity(city, activeCity) ? " active" : ""}`}
        >
          <button
            type="button"
            className="favorite-chip-name"
            onClick={() => onSelect(city)}
            title={[city.admin1, city.country].filter(Boolean).join(", ")}
          >
            {city.name}
          </button>
          <button
            type="button"
            className="favorite-chip-remove"
            onClick={() => onRemove(city)}
            aria-label={`Remove ${city.name} from favourites`}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}