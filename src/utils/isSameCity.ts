// ===== utils/isSameCity.ts =====
// Answers: "are these two City objects the same place?"

import type { City } from "../types/weather";

// IMPORTANT: we compare coordinates, not names. Names can repeat
// ("Springfield") and the same city can be spelled differently.
// 0.01 degrees is roughly 1 km, so tiny differences still count as the same city.
export function isSameCity(a: City, b: City): boolean {
  return (
    Math.abs(a.latitude - b.latitude) < 0.01 &&
    Math.abs(a.longitude - b.longitude) < 0.01
  );
}