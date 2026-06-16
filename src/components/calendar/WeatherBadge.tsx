import type { DayForecast } from "@/lib/types/weather";

type WeatherBadgeProps = {
  forecast: DayForecast;
  className?: string;
};

export function WeatherBadge({ forecast, className = "" }: WeatherBadgeProps) {
  const ariaLabel = `${forecast.label}, ${forecast.tempMin} à ${forecast.tempMax} degrés`;

  return (
    <span
      className={`pointer-events-none inline-flex items-center gap-0.5 text-[10px] leading-none text-[var(--muted)] ${className}`.trim()}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <span aria-hidden>{forecast.icon}</span>
      <span>{forecast.tempMax}°</span>
    </span>
  );
}
