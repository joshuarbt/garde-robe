"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { saveWeatherLocation } from "@/lib/weather/actions";
import { searchCity } from "@/lib/weather/open-meteo";
import type { CitySearchResult, WeatherLocation } from "@/lib/types/weather";

type WeatherLocationPromptProps = {
  open: boolean;
  onClose: () => void;
  onLocationSaved: (location: WeatherLocation) => void;
};

export function WeatherLocationPrompt({
  open,
  onClose,
  onLocationSaved,
}: WeatherLocationPromptProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<number | null>(null);

  function handleQueryChange(value: string) {
    setQuery(value);

    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }

    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = window.setTimeout(() => {
      void searchCity(trimmed)
        .then((cityResults) => {
          setResults(cityResults);
          setError(null);
        })
        .catch(() => {
          setResults([]);
          setError("Recherche de ville indisponible.");
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, 300);
  }

  function persistLocation(location: WeatherLocation) {
    setError(null);
    startTransition(async () => {
      const result = await saveWeatherLocation(location);
      if (!result.success) {
        setError(result.error);
        return;
      }

      onLocationSaved(location);
      router.refresh();
      onClose();
    });
  }

  function handleUseCurrentPosition() {
    if (!navigator.geolocation) {
      setError("Impossible d'accéder à votre position. Recherchez une ville.");
      return;
    }

    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        persistLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          label: "Ma position",
        });
      },
      () => {
        setError("Impossible d'accéder à votre position. Recherchez une ville.");
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  }

  function handleSelectCity(result: CitySearchResult) {
    const label = result.admin1
      ? `${result.name}, ${result.admin1}`
      : `${result.name}, ${result.country}`;

    persistLocation({
      latitude: result.latitude,
      longitude: result.longitude,
      label,
    });
  }

  if (!open) {
    return null;
  }

  return (
    <BottomSheet
      open
      title="Météo locale"
      titleId="weather-location-title"
      onClose={onClose}
    >
      <p className="text-sm text-[var(--muted)]">
        Indiquez votre lieu pour afficher la météo sur le calendrier.
      </p>

      <div className="mt-6 space-y-4">
        <button
          type="button"
          onClick={handleUseCurrentPosition}
          disabled={isPending}
          className="btn-primary w-full min-h-[var(--touch-min)]"
        >
          Utiliser ma position
        </button>

        <div className="space-y-2">
          <label htmlFor="weather-city-search" className="text-overline">
            Ou rechercher une ville
          </label>
          <input
            id="weather-city-search"
            type="search"
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            placeholder="Paris, Lyon…"
            disabled={isPending}
            className="input-field w-full"
            autoComplete="off"
          />
        </div>

        {isSearching ? (
          <p className="text-caption text-[var(--muted)]">Recherche…</p>
        ) : null}

        {results.length > 0 ? (
          <ul className="divide-y divide-[var(--border-hairline)] overflow-hidden rounded-sm border border-[var(--border-subtle)]">
            {results.map((result) => {
              const subtitle = result.admin1
                ? `${result.admin1}, ${result.country}`
                : result.country;

              return (
                <li key={`${result.name}-${result.latitude}-${result.longitude}`}>
                  <button
                    type="button"
                    onClick={() => handleSelectCity(result)}
                    disabled={isPending}
                    className="flex w-full min-h-[var(--touch-min)] flex-col items-start px-3 py-2 text-left transition-opacity active:opacity-70"
                  >
                    <span className="text-sm text-[var(--foreground)]">{result.name}</span>
                    <span className="text-caption text-[var(--muted)]">{subtitle}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="text-status-error mt-4 text-sm">
          {error}
        </p>
      ) : null}
    </BottomSheet>
  );
}
