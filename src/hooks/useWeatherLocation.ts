"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import {
  readWeatherLocationCache,
  writeWeatherLocationCache,
} from "@/lib/weather/client-storage";
import {
  persistWeatherCityByName,
  persistWeatherLocation,
} from "@/lib/weather/persist";
import type { WeatherActionResult, WeatherLocation } from "@/lib/types/weather";

function resolveWeatherLocation(
  serverLocation: WeatherLocation | null,
): WeatherLocation | null {
  if (serverLocation) {
    writeWeatherLocationCache(serverLocation);
    return serverLocation;
  }

  return readWeatherLocationCache();
}

function locationKey(location: WeatherLocation | null): string {
  if (!location) {
    return "";
  }

  return `${location.latitude},${location.longitude},${location.label}`;
}

export function useWeatherLocation(initialLocation: WeatherLocation | null) {
  const router = useRouter();
  const resolvedFromServer = resolveWeatherLocation(initialLocation);
  const [location, setLocation] = useState(resolvedFromServer);
  const [prevResolvedKey, setPrevResolvedKey] = useState(() =>
    locationKey(resolvedFromServer),
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const resolvedKey = locationKey(resolvedFromServer);
  if (resolvedKey !== prevResolvedKey) {
    setPrevResolvedKey(resolvedKey);
    setLocation(resolvedFromServer);
  }

  const saveLocation = useCallback(
    (nextLocation: WeatherLocation): Promise<WeatherActionResult> => {
      setError(null);

      return new Promise((resolve) => {
        startTransition(async () => {
          const result = await persistWeatherLocation(nextLocation);

          if (!result.success) {
            setError(result.error);
            resolve(result);
            return;
          }

          const saved = result.location ?? nextLocation;
          setLocation(saved);
          router.refresh();
          resolve(result);
        });
      });
    },
    [router],
  );

  const saveCityByName = useCallback(
    (cityName: string): Promise<WeatherActionResult> => {
      setError(null);

      return new Promise((resolve) => {
        startTransition(async () => {
          const result = await persistWeatherCityByName(cityName);

          if (!result.success) {
            setError(result.error);
            resolve(result);
            return;
          }

          if (result.location) {
            setLocation(result.location);
          }

          router.refresh();
          resolve(result);
        });
      });
    },
    [router],
  );

  return {
    location,
    setLocation,
    saveLocation,
    saveCityByName,
    isSaving: isPending,
    error,
  };
}
