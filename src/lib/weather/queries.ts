import type { WeatherLocation } from "@/lib/types/weather";
import { createClient } from "@/lib/supabase/server";

export async function getWeatherLocation(): Promise<WeatherLocation | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("weather_latitude, weather_longitude, weather_location_label")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (
    data?.weather_latitude == null ||
    data?.weather_longitude == null ||
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
