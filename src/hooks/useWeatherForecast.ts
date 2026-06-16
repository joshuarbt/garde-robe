"use client";

import { useCallback, useSyncExternalStore } from "react";
import { getCachedForecasts, setCachedForecasts } from "@/lib/weather/cache";
import type { DayForecast, WeatherLocation } from "@/lib/types/weather";

type ForecastResponse = {
  forecasts?: DayForecast[];
  error?: string;
};

type WeatherStoreEntry = {
  forecasts: DayForecast[];
  isLoading: boolean;
  error: string | null;
};

const EMPTY_ENTRY: WeatherStoreEntry = {
  forecasts: [],
  isLoading: false,
  error: null,
};

const store = new Map<string, WeatherStoreEntry>();
const listeners = new Set<() => void>();
const inflight = new Set<string>();

function getLocationKey(location: WeatherLocation): string {
  return `${location.latitude.toFixed(2)},${location.longitude.toFixed(2)}`;
}

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}

function setStoreEntry(key: string, entry: WeatherStoreEntry): void {
  store.set(key, entry);
  notify();
}

async function loadForecastsForLocation(
  location: WeatherLocation,
  force = false,
): Promise<void> {
  const key = getLocationKey(location);

  if (inflight.has(key)) {
    return;
  }

  if (!force) {
    const cached = getCachedForecasts(location.latitude, location.longitude);
    if (cached) {
      setStoreEntry(key, {
        forecasts: cached,
        isLoading: false,
        error: null,
      });
      return;
    }
  }

  inflight.add(key);
  setStoreEntry(key, {
    forecasts: store.get(key)?.forecasts ?? [],
    isLoading: true,
    error: null,
  });

  try {
    const params = new URLSearchParams({
      lat: String(location.latitude),
      lon: String(location.longitude),
    });

    const response = await fetch(`/api/weather/forecast?${params.toString()}`);
    const data = (await response.json()) as ForecastResponse;

    if (!response.ok) {
      throw new Error(data.error ?? "Impossible de récupérer la météo.");
    }

    const forecasts = data.forecasts ?? [];
    setCachedForecasts(location.latitude, location.longitude, forecasts);
    setStoreEntry(key, {
      forecasts,
      isLoading: false,
      error: null,
    });
  } catch (fetchError) {
    setStoreEntry(key, {
      forecasts: [],
      isLoading: false,
      error:
        fetchError instanceof Error
          ? fetchError.message
          : "Impossible de récupérer la météo.",
    });
  } finally {
    inflight.delete(key);
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(key: string | null): WeatherStoreEntry {
  if (!key) {
    return EMPTY_ENTRY;
  }

  return store.get(key) ?? EMPTY_ENTRY;
}

function ensureLoaded(location: WeatherLocation | null): void {
  if (!location) {
    return;
  }

  const key = getLocationKey(location);
  const current = store.get(key);

  if (current?.isLoading || inflight.has(key)) {
    return;
  }

  if (current && current.forecasts.length > 0 && !current.error) {
    return;
  }

  const cached = getCachedForecasts(location.latitude, location.longitude);
  if (cached) {
    setStoreEntry(key, {
      forecasts: cached,
      isLoading: false,
      error: null,
    });
    return;
  }

  void loadForecastsForLocation(location);
}

export function useWeatherForecast(location: WeatherLocation | null) {
  const key = location ? getLocationKey(location) : null;
  ensureLoaded(location);

  const entry = useSyncExternalStore(
    subscribe,
    () => getSnapshot(key),
    () => getSnapshot(key),
  );

  const forecastsByDate = new Map<string, DayForecast>();
  if (location) {
    for (const forecast of entry.forecasts) {
      forecastsByDate.set(forecast.date, forecast);
    }
  }

  const refetch = useCallback(() => {
    if (!location) {
      return;
    }

    void loadForecastsForLocation(location, true);
  }, [location]);

  return {
    forecastsByDate,
    isLoading: Boolean(location) && entry.isLoading,
    error: location ? entry.error : null,
    refetch,
  };
}
