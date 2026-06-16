import type { DayForecast } from "@/lib/types/weather";

const CACHE_TTL_MS = 60 * 60 * 1000;
const CACHE_PREFIX = "garde-robe:weather:";

type CacheEntry = {
  fetchedAt: number;
  forecasts: DayForecast[];
};

const memoryCache = new Map<string, CacheEntry>();

function getCacheKey(latitude: number, longitude: number): string {
  return `${CACHE_PREFIX}${latitude.toFixed(2)},${longitude.toFixed(2)}`;
}

function readFromSessionStorage(key: string): CacheEntry | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as CacheEntry;
  } catch {
    return null;
  }
}

function writeToSessionStorage(key: string, entry: CacheEntry): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    sessionStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // Ignore quota errors
  }
}

function isFresh(entry: CacheEntry): boolean {
  return Date.now() - entry.fetchedAt < CACHE_TTL_MS;
}

export function getCachedForecasts(
  latitude: number,
  longitude: number,
): DayForecast[] | null {
  const key = getCacheKey(latitude, longitude);
  const memoryEntry = memoryCache.get(key);

  if (memoryEntry && isFresh(memoryEntry)) {
    return memoryEntry.forecasts;
  }

  const sessionEntry = readFromSessionStorage(key);
  if (sessionEntry && isFresh(sessionEntry)) {
    memoryCache.set(key, sessionEntry);
    return sessionEntry.forecasts;
  }

  return null;
}

export function setCachedForecasts(
  latitude: number,
  longitude: number,
  forecasts: DayForecast[],
): void {
  const key = getCacheKey(latitude, longitude);
  const entry: CacheEntry = {
    fetchedAt: Date.now(),
    forecasts,
  };

  memoryCache.set(key, entry);
  writeToSessionStorage(key, entry);
}
