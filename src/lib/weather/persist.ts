"use client";

import { writeWeatherLocationCache } from "@/lib/weather/client-storage";
import {
  saveWeatherCityByName,
  saveWeatherLocation,
} from "@/lib/weather/actions";
import type { WeatherActionResult, WeatherLocation } from "@/lib/types/weather";

export async function persistWeatherLocation(
  location: WeatherLocation,
): Promise<WeatherActionResult> {
  const result = await saveWeatherLocation(location);

  if (result.success) {
    writeWeatherLocationCache(result.location ?? location);
  }

  return result;
}

export async function persistWeatherCityByName(
  cityName: string,
): Promise<WeatherActionResult> {
  const result = await saveWeatherCityByName(cityName);

  if (result.success && result.location) {
    writeWeatherLocationCache(result.location);
  }

  return result;
}
