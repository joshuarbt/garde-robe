"use server";

import { revalidatePath } from "next/cache";
import type { WeatherActionResult } from "@/lib/types/weather";
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
  const { error } = await supabase
    .from("profiles")
    .update({
      weather_latitude: latitude,
      weather_longitude: longitude,
      weather_location_label: trimmedLabel,
    })
    .eq("id", userResult);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/calendar");
  return { success: true };
}
