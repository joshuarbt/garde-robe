-- Initial schema for Garde-robe wardrobe app

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helper: auto-update updated_at
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- categories (user-scoped)
-- ---------------------------------------------------------------------------

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  item_type text not null check (item_type in ('clothing', 'accessory', 'jewelry')),
  created_at timestamptz not null default now(),
  unique (user_id, name, item_type)
);

create index categories_user_id_idx on public.categories (user_id);

-- ---------------------------------------------------------------------------
-- colors (global seed)
-- ---------------------------------------------------------------------------

create table public.colors (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  hex_code text,
  sort_order smallint not null default 0
);

-- ---------------------------------------------------------------------------
-- brands (user-scoped)
-- ---------------------------------------------------------------------------

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create index brands_user_id_idx on public.brands (user_id);

-- ---------------------------------------------------------------------------
-- seasons (global seed)
-- ---------------------------------------------------------------------------

create table public.seasons (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order smallint not null default 0
);

-- ---------------------------------------------------------------------------
-- items
-- ---------------------------------------------------------------------------

create table public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  item_type text not null check (item_type in ('clothing', 'accessory', 'jewelry')),
  category_id uuid references public.categories (id) on delete set null,
  color_id uuid references public.colors (id) on delete set null,
  brand_id uuid references public.brands (id) on delete set null,
  occasion_tags text[] not null default '{}',
  image_path text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index items_user_id_idx on public.items (user_id);
create index items_user_id_item_type_idx on public.items (user_id, item_type);
create index items_user_id_category_id_idx on public.items (user_id, category_id);
create index items_user_id_color_id_idx on public.items (user_id, color_id);
create index items_occasion_tags_gin_idx on public.items using gin (occasion_tags);

create trigger items_set_updated_at
before update on public.items
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- item_seasons (junction)
-- ---------------------------------------------------------------------------

create table public.item_seasons (
  item_id uuid not null references public.items (id) on delete cascade,
  season_id uuid not null references public.seasons (id) on delete cascade,
  primary key (item_id, season_id)
);

create index item_seasons_season_id_idx on public.item_seasons (season_id);

-- ---------------------------------------------------------------------------
-- outfits
-- ---------------------------------------------------------------------------

create table public.outfits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index outfits_user_id_idx on public.outfits (user_id);

create trigger outfits_set_updated_at
before update on public.outfits
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- outfit_items (canvas placements)
-- ---------------------------------------------------------------------------

create table public.outfit_items (
  id uuid primary key default gen_random_uuid(),
  outfit_id uuid not null references public.outfits (id) on delete cascade,
  item_id uuid not null references public.items (id) on delete cascade,
  position_x double precision not null default 0,
  position_y double precision not null default 0,
  scale double precision not null default 1,
  rotation double precision not null default 0,
  z_index integer not null default 0,
  unique (outfit_id, item_id)
);

create index outfit_items_outfit_id_idx on public.outfit_items (outfit_id);

-- ---------------------------------------------------------------------------
-- Seed: colors
-- ---------------------------------------------------------------------------

insert into public.colors (name, hex_code, sort_order) values
  ('black', '#000000', 1),
  ('white', '#ffffff', 2),
  ('gray', '#808080', 3),
  ('beige', '#f5f5dc', 4),
  ('brown', '#8b4513', 5),
  ('navy', '#001f3f', 6),
  ('blue', '#0074d9', 7),
  ('green', '#2ecc40', 8),
  ('red', '#ff4136', 9),
  ('pink', '#ff69b4', 10),
  ('purple', '#b10dc9', 11),
  ('multicolor', null, 12);

-- ---------------------------------------------------------------------------
-- Seed: seasons
-- ---------------------------------------------------------------------------

insert into public.seasons (name, sort_order) values
  ('spring', 1),
  ('summer', 2),
  ('fall', 3),
  ('winter', 4),
  ('all-season', 5);
