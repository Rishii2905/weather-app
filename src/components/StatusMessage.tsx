// ===== components/StatusMessage.tsx =====
// Shows "Loading..." or an error with a Retry button. Display only.

interface StatusMessageProps {
    type: "loading" | "error";
    message?: string;
    onRetry?: () => void;
  }
  
  export default function StatusMessage({ type, message, onRetry }: StatusMessageProps) {
    if (type === "loading") {
      return (
        <div className="card status">
          <div className="spinner" aria-hidden="true" />
          <p>Loading weather…</p>
        </div>
      );
    }
  
    return (
      <div className="card status">
        <p>⚠️ {message ?? "Something went wrong."}</p>
        {onRetry && (
          <button className="retry-button" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    );
  }