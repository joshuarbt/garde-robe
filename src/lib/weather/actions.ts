"use server";

import { revalidatePath } from "next/cache";
import { resolveCityQuery } from "@/lib/weather/location";
import type { WeatherActionResult, WeatherLocation } from "@/lib/types/weather";
import { createClient } from "@/lib/supabase/server";

async function requireUserId(): Promise<string | WeatherActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Vous devez être connecté." };
  }

  return user.id;
}

function revalidateWeatherPaths(): void {
  revalidatePath("/calendar");
  revalidatePath("/dashboard");
}

function rowToWeatherLocation(data: {
  weather_latitude: number | null;
  weather_longitude: number | null;
  weather_location_label: string | null;
}): WeatherLocation | null {
  if (
    data.weather_latitude == null ||
    data.weather_longitude == null ||
    !data.weather_location_label
  ) {
    return null;
  }

  return {
    latitude: data.weather_latitude,
    longitude: data.weather_longitude,
    label: data.weather_location_label,
  };
}

export async function saveWeatherLocation(input: {
  latitude: number;
  longitude: number;
  label: string;
}): Promise<WeatherActionResult> {
  const userResult = await requireUserId();
  if (typeof userResult !== "string") {
    return userResult;
  }

  const { latitude, longitude, label } = input;

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return { success: false, error: "Coordonnées invalides." };
  }

  const trimmedLabel = label.trim();
  if (!trimmedLabel) {
    return { success: false, error: "Nom de lieu requis." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userResult,
        weather_latitude: latitude,
        weather_longitude: longitude,
        weather_location_label: trimmedLabel,
      },
      { onConflict: "id" },
    )
    .select("weather_latitude, weather_longitude, weather_location_label")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  const location = rowToWeatherLocation(data);
  if (!location) {
    return {
      success: false,
      error: "Impossible d'enregistrer la ville. Réessayez.",
    };
  }

  revalidateWeatherPaths();
  return { success: true, location };
}

export async function saveWeatherCityByName(
  cityName: string,
): Promise<WeatherActionResult> {
  const userResult = await requireUserId();
  if (typeof userResult !== "string") {
    return userResult;
  }

  const resolved = await resolveCityQuery(cityName);
  if (!resolved.success) {
    return resolved;
  }

  return saveWeatherLocation(resolved.location);
}
