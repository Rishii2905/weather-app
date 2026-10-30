// ===== utils/timeOfDay.ts =====
// Decides: is it morning, noon, evening or night in THE CITY right now?

export type TimeOfDay = "morning" | "noon" | "evening" | "night";

// "2026-10-30T16:15" -> 975 (minutes since midnight)
// IMPORTANT: we read the hours/minutes straight from the text instead of
// using new Date(). new Date() would convert to YOUR computer's timezone
// and give the wrong answer for another city.
function toMinutes(isoLocal: string): number {
  const [hours, minutes] = isoLocal.slice(11, 16).split(":").map(Number);
  return hours * 60 + minutes;
}

export function getTimeOfDay(
  currentTime: string,
  sunrise: string,
  sunset: string
): TimeOfDay {
  const now = toMinutes(currentTime);
  const sunriseMin = toMinutes(sunrise);
  const sunsetMin = toMinutes(sunset);

  // IMPORTANT: these rules are the theme logic. Tweak the numbers to taste.
  if (now < sunriseMin) return "night"; // before sunrise
  if (now < 11 * 60) return "morning"; // sunrise -> 11:00
  if (now < sunsetMin - 120) return "noon"; // 11:00 -> 2h before sunset
  if (now < sunsetMin + 60) return "evening"; // 2h before -> 1h after sunset
  return "night";
}