import { getWeatherInfo } from "@/lib/weather/codes";
import type { CitySearchResult, DayForecast } from "@/lib/types/weather";

type OpenMeteoDailyResponse = {
  daily?: {
    time?: string[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    weathercode?: number[];
  };
};

type OpenMeteoGeocodingResponse = {
  results?: Array<{
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
  }>;
};

export async function fetchForecast(
  latitude: number,
  longitude: number,
  forecastDays = 14,
): Promise<DayForecast[]> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    daily: "temperature_2m_max,temperature_2m_min,weathercode",
    timezone: "auto",
    forecast_days: String(forecastDays),
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
    { next: { revalidate: 3600 } },
  );

  if (!response.ok) {
    throw new Error("Impossible de récupérer la météo.");
  }

  const data = (await response.json()) as OpenMeteoDailyResponse;
  const daily = data.daily;

  if (!daily?.time?.length) {
    return [];
  }

  return daily.time.map((date, index) => {
    const weatherCode = daily.weathercode?.[index] ?? 0;
    const { icon, label } = getWeatherInfo(weatherCode);

    return {
      date,
      tempMin: Math.round(daily.temperature_2m_min?.[index] ?? 0),
      tempMax: Math.round(daily.temperature_2m_max?.[index] ?? 0),
      weatherCode,
      label,
      icon,
    };
  });
}

export async function searchCity(query: string): Promise<CitySearchResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return [];
  }

  const params = new URLSearchParams({
    name: trimmed,
    count: "5",
    language: "fr",
    format: "json",
  });

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Recherche de ville indisponible.");
  }

  const data = (await response.json()) as OpenMeteoGeocodingResponse;

  return (data.results ?? []).map((result) => ({
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country,
    admin1: result.admin1,
  }));
}
