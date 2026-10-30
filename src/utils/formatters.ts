// ===== utils/formatters.ts =====
// Small helpers that make raw values look nice on screen.

// "2026-10-30T18:12" -> "6:12 PM"
// IMPORTANT: built from the text (not new Date) so the city's own time shows
// correctly regardless of where YOU are.
export function formatTime(isoLocal: string): string {
    const [hours, minutes] = isoLocal.slice(11, 16).split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
  }
  
  // "2026-10-30T17:00" -> "5 PM"
  export function formatHour(isoLocal: string): string {
    const hours = Number(isoLocal.slice(11, 13));
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    return `${hour12} ${period}`;
  }
  
  // "2026-10-31" -> "Sat" (or "Today" for the first row)
  export function formatDay(date: string, index: number): string {
    if (index === 0) return "Today";
    // Adding T00:00:00 makes JS read it as local midnight, so the weekday is correct
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "short",
    });
  }
  
  // "2026-10-31" -> "Oct 31"
  export function formatDate(date: string): string {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
  
  // 27.6 -> "28°"
  export function formatTemp(value: number): string {
    return `${Math.round(value)}°`;
  }