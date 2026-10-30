// ===== api/geocodingApi.ts =====
// Turns a city NAME ("Paris") into coordinates (lat/lon). Network only, no UI.

import { GEOCODING_URL } from "../constants/config";
import type { City, GeocodingResponse } from "../types/weather";

export async function searchCities(
  query: string,
  signal?: AbortSignal // IMPORTANT: lets us cancel the request if the user keeps typing
): Promise<City[]> {
  const text = query.trim();
  if (text.length < 2) return []; // don't call the API for 0-1 letters

  const params = new URLSearchParams({
    name: text,
    count: "5", // max 5 suggestions
    language: "en",
    format: "json",
  });

  const response = await fetch(`${GEOCODING_URL}?${params}`, { signal });
  if (!response.ok) throw new Error("City search failed. Please try again.");

  const data: GeocodingResponse = await response.json();

  // IMPORTANT: when nothing matches, the API omits "results" entirely
  return (data.results ?? []).map((item) => ({
    name: item.name,
    country: item.country ?? "",
    admin1: item.admin1,
    latitude: item.latitude,
    longitude: item.longitude,
  }));
}