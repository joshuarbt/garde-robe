import { fetchForecast } from "@/lib/weather/open-meteo";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    return Response.json({ error: "Coordonnées invalides." }, { status: 400 });
  }

  try {
    const forecasts = await fetchForecast(lat, lon);

    return Response.json(
      { forecasts },
      {
        headers: {
          "Cache-Control": "private, max-age=3600",
        },
      },
    );
  } catch {
    return Response.json(
      { error: "Impossible de récupérer la météo." },
      { status: 502 },
    );
  }
}
