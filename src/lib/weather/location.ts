import { searchCity } from "@/lib/weather/open-meteo";
import type { CitySearchResult, WeatherLocation } from "@/lib/types/weather";

export function formatCityLabel(result: CitySearchResult): string {
  return result.admin1
    ? `${result.name}, ${result.admin1}`
    : `${result.name}, ${result.country}`;
}

export function cityResultToLocation(result: CitySearchResult): WeatherLocation {
  return {
    latitude: result.latitude,
    longitude: result.longitude,
    label: formatCityLabel(result),
  };
}

export async function resolveCityQuery(
  query: string,
): Promise<
  | { success: true; location: WeatherLocation }
  | { success: false; error: string }
> {
  const trimmed = query.trim();

  if (trimmed.length < 2) {
    return { success: false, error: "Saisissez au moins 2 caractères." };
  }

  try {
    const results = await searchCity(trimmed);

    if (results.length === 0) {
      return {
        success: false,
        error: "Ville introuvable. Vérifiez l'orthographe.",
      };
    }

    return {
      success: true,
      location: cityResultToLocation(results[0]),
    };
  } catch {
    return { success: false, error: "Recherche de ville indisponible." };
  }
}
