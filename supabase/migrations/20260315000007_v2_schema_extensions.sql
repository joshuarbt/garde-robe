-- V2 extensions for databases that applied the former split migrations
-- (20260315000005_item_price.sql and 20260315000006_outfit_calendar.sql)
-- Safe to run after 20260315000005_v2_schema.sql — all statements are idempotent.

alter table public.outfits
  add column if not exists notes text null,
  add column if not exists cover_image_url text null;

alter table public.outfit_calendar_entries
  add column if not exists occasion text null,
  add column if not exists notes text null;
