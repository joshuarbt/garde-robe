-- Weather location preferences for calendar forecast

alter table public.profiles
  add column if not exists weather_latitude double precision,
  add column if not exists weather_longitude double precision,
  add column if not exists weather_location_label text;
