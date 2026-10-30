// ===== utils/aqiScale.ts =====
// Converts an AQI number into a category name + colour (US AQI scale).

interface AqiInfo {
    label: string;
    color: string;
  }
  
  export function getAqiInfo(aqi: number): AqiInfo {
    if (aqi <= 50) return { label: "Good", color: "#22c55e" };
    if (aqi <= 100) return { label: "Moderate", color: "#eab308" };
    if (aqi <= 150) return { label: "Unhealthy for sensitive groups", color: "#f97316" };
    if (aqi <= 200) return { label: "Unhealthy", color: "#ef4444" };
    if (aqi <= 300) return { label: "Very unhealthy", color: "#a855f7" };
    return { label: "Hazardous", color: "#be123c" };
  }