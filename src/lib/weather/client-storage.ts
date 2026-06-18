import type { WeatherLocation } from "@/lib/types/weather";

const STORAGE_KEY = "garde-robe:weather-location";

function isValidLocation(value: unknown): value is WeatherLocation {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as WeatherLocation;
  return (
    typeof candidate.label === "string" &&
    candidate.label.trim().length > 0 &&
    Number.isFinite(candidate.latitude) &&
    Number.isFinite(candidate.longitude) &&
    candidate.latitude >= -90 &&
    candidate.latitude <= 90 &&
    candidate.longitude >= -180 &&
    candidate.longitude <= 180
  );
}

export function readWeatherLocationCache(): WeatherLocation | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!isValidLocation(parsed)) {
      return null;
    }

    return {
      latitude: parsed.latitude,
      longitude: parsed.longitude,
      label: parsed.label.trim(),
    };
  } catch {
    return null;
  }
}

export function writeWeatherLocationCache(location: WeatherLocation): void {
  if (typeof window === "undefined" || !isValidLocation(location)) {
    return;
  }

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        latitude: location.latitude,
        longitude: location.longitude,
        label: location.label.trim(),
      }),
    );
  } catch {
    // Ignore quota errors
  }
}

export function clearWeatherLocationCache(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}
