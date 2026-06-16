import type { DayForecast } from "@/lib/types/weather";

type WeatherDetailProps = {
  forecast?: DayForecast | null;
  isLoading?: boolean;
  error?: string | null;
};

export function WeatherDetail({ forecast, isLoading, error }: WeatherDetailProps) {
  if (isLoading) {
    return <p className="text-caption mt-3 text-[var(--muted)]">Chargement de la météo…</p>;
  }

  if (error) {
    return <p className="text-caption mt-3 text-[var(--muted)]">Météo indisponible</p>;
  }

  if (!forecast) {
    return null;
  }

  return (
    <div className="mt-3 space-y-0.5 text-sm text-[var(--muted)]">
      <p>
        <span aria-hidden>{forecast.icon}</span> {forecast.label}
      </p>
      <p>
        {forecast.tempMin}° / {forecast.tempMax}°
      </p>
    </div>
  );
}
