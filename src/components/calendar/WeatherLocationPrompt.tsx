"use client";

import { useRef, useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { cityResultToLocation } from "@/lib/weather/location";
import { searchCity } from "@/lib/weather/open-meteo";
import type {
  CitySearchResult,
  WeatherActionResult,
  WeatherLocation,
} from "@/lib/types/weather";

type WeatherLocationPromptProps = {
  open: boolean;
  onClose: () => void;
  onLocationSaved: () => void;
  saveLocation: (location: WeatherLocation) => Promise<WeatherActionResult>;
  saveCityByName: (cityName: string) => Promise<WeatherActionResult>;
  isSaving: boolean;
};

export function WeatherLocationPrompt({
  open,
  onClose,
  onLocationSaved,
  saveLocation,
  saveCityByName,
  isSaving,
}: WeatherLocationPromptProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<number | null>(null);

  function handleQueryChange(value: string) {
    setQuery(value);
    setHasSearched(false);

    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }

    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsSearching(false);
      setError(null);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = window.setTimeout(() => {
      void searchCity(trimmed)
        .then((cityResults) => {
          setResults(cityResults);
          setHasSearched(true);
          setError(null);
        })
        .catch(() => {
          setResults([]);
          setHasSearched(true);
          setError("Recherche de ville indisponible.");
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, 300);
  }

  async function handleSaveCity() {
    setError(null);
    const result = await saveCityByName(query);
    if (!result.success) {
      setError(result.error);
      return;
    }

    onLocationSaved();
    onClose();
  }

  async function handleSelectCity(result: CitySearchResult) {
    setError(null);
    const location = cityResultToLocation(result);
    const saveResult = await saveLocation(location);
    if (!saveResult.success) {
      setError(saveResult.error);
      return;
    }

    onLocationSaved();
    onClose();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void handleSaveCity();
  }

  const showNoResults =
    hasSearched && !isSearching && query.trim().length >= 2 && results.length === 0;

  if (!open) {
    return null;
  }

  return (
    <BottomSheet
      open
      title="Ville météo par défaut"
      titleId="weather-location-title"
      onClose={onClose}
    >
      <p className="text-sm text-[var(--muted)]">
        Choisissez votre ville pour afficher la météo sur le calendrier.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="weather-city-search" className="text-overline">
            Rechercher une ville
          </label>
          <input
            id="weather-city-search"
            type="search"
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            placeholder="Paris, Lyon…"
            disabled={isSaving}
            className="input-field w-full"
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving || query.trim().length < 2}
          className="btn-primary w-full min-h-[var(--touch-min)] disabled:opacity-60"
        >
          {isSaving ? "Enregistrement…" : "Enregistrer cette ville"}
        </button>

        {isSearching ? (
          <p className="text-caption text-[var(--muted)]">Recherche…</p>
        ) : null}

        {showNoResults ? (
          <p className="text-caption text-[var(--muted)]">
            Ville introuvable. Vérifiez l&apos;orthographe.
          </p>
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
                    onClick={() => void handleSelectCity(result)}
                    disabled={isSaving}
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
      </form>

      {error ? (
        <p role="alert" className="text-status-error mt-4 text-sm">
          {error}
        </p>
      ) : null}
    </BottomSheet>
  );
}
