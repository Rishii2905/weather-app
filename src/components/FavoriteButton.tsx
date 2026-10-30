// ===== components/FavoriteButton.tsx =====
// The "Add to favourites" button. Display only: it just reports clicks.

interface FavoriteButtonProps {
    isFavorite: boolean;
    disabled: boolean; // true when the list is full and this city isn't saved
    onToggle: () => void;
  }
  
  export default function FavoriteButton({ isFavorite, disabled, onToggle }: FavoriteButtonProps) {
    return (
      <button
        type="button"
        className={`favorite-button${isFavorite ? " active" : ""}`}
        onClick={onToggle}
        disabled={disabled}
        // IMPORTANT: aria-pressed tells screen readers this is an on/off button
        aria-pressed={isFavorite}
        title={
          disabled
            ? "Favourites are full. Remove one first."
            : isFavorite
            ? "Remove from favourites"
            : "Add to favourites"
        }
      >
        <span className="favorite-star">{isFavorite ? "★" : "☆"}</span>
        {isFavorite ? "In favourites" : "Add to favourites"}
      </button>
    );
  }