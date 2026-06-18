"use client";

import { useState } from "react";
import { useWeatherLocation } from "@/hooks/useWeatherLocation";
import type { WeatherLocation } from "@/lib/types/weather";

type WeatherCitySettingsProps = {
  initialLocation: WeatherLocation | null;
};

export function WeatherCitySettings({ initialLocation }: WeatherCitySettingsProps) {
  const { location, saveCityByName, isSaving, error: saveError } =
    useWeatherLocation(initialLocation);
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const city = draft ?? location?.label ?? "";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    void saveCityByName(city).then((result) => {
      if (!result.success) {
        setError(result.error);
        return;
      }

      if (result.location) {
        setDraft(null);
      }

      setSuccess("Ville enregistrée.");
    });
  }

  const displayError = error ?? saveError;

  return (
    <section className="space-y-4 border-t border-[var(--border-hairline)] pt-8">
      <div>
        <h2 className="text-title">Préférences</h2>
        <p className="text-caption mt-2 text-[var(--muted)]">
          La météo du calendrier utilise cette ville par défaut.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label htmlFor="default-weather-city" className="input-label">
            Ville météo par défaut
          </label>
          <input
            id="default-weather-city"
            type="search"
            value={city}
            onChange={(event) => {
              setDraft(event.target.value);
              setSuccess(null);
              setError(null);
            }}
            placeholder="Paris, Lyon…"
            disabled={isSaving}
            className="input-field mt-1.5"
            autoComplete="off"
          />
        </div>

        <button type="submit" disabled={isSaving} className="btn-secondary disabled:opacity-60">
          {isSaving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </form>

      {displayError ? (
        <p role="alert" className="text-status-error text-sm">
          {displayError}
        </p>
      ) : null}
      {success ? (
        <p role="status" className="text-caption text-[var(--status-success)]">
          {success}
        </p>
      ) : null}
    </section>
  );
}
