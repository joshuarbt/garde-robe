-- Trips / suitcase packing lists

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  destination text,
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date is null or start_date is null or end_date >= start_date)
);

create index if not exists trips_user_id_idx on public.trips (user_id);

drop trigger if exists trips_set_updated_at on public.trips;

create trigger trips_set_updated_at
before update on public.trips
for each row
execute function public.set_updated_at();

create table if not exists public.trip_outfits (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  outfit_id uuid not null references public.outfits (id) on delete cascade,
  unique (trip_id, outfit_id)
);

create index if not exists trip_outfits_trip_id_idx on public.trip_outfits (trip_id);

create table if not exists public.trip_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  item_id uuid not null references public.items (id) on delete cascade,
  is_packed boolean not null default false,
  unique (trip_id, item_id)
);

create index if not exists trip_items_trip_id_idx on public.trip_items (trip_id);

-- RLS: trips
alter table public.trips enable row level security;

drop policy if exists "trips_select_own" on public.trips;
create policy "trips_select_own"
on public.trips for select to authenticated
using (user_id = auth.uid());

drop policy if exists "trips_insert_own" on public.trips;
create policy "trips_insert_own"
on public.trips for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "trips_update_own" on public.trips;
create policy "trips_update_own"
on public.trips for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "trips_delete_own" on public.trips;
create policy "trips_delete_own"
on public.trips for delete to authenticated
using (user_id = auth.uid());

-- RLS: trip_outfits
alter table public.trip_outfits enable row level security;

drop policy if exists "trip_outfits_select_own" on public.trip_outfits;
create policy "trip_outfits_select_own"
on public.trip_outfits for select to authenticated
using (
  exists (
    select 1 from public.trips
    where trips.id = trip_outfits.trip_id
      and trips.user_id = auth.uid()
  )
);

drop policy if exists "trip_outfits_insert_own" on public.trip_outfits;
create policy "trip_outfits_insert_own"
on public.trip_outfits for insert to authenticated
with check (
  exists (
    select 1 from public.trips
    where trips.id = trip_outfits.trip_id
      and trips.user_id = auth.uid()
  )
  and exists (
    select 1 from public.outfits
    where outfits.id = trip_outfits.outfit_id
      and outfits.user_id = auth.uid()
  )
);

drop policy if exists "trip_outfits_delete_own" on public.trip_outfits;
create policy "trip_outfits_delete_own"
on public.trip_outfits for delete to authenticated
using (
  exists (
    select 1 from public.trips
    where trips.id = trip_outfits.trip_id
      and trips.user_id = auth.uid()
  )
);

-- RLS: trip_items
alter table public.trip_items enable row level security;

drop policy if exists "trip_items_select_own" on public.trip_items;
create policy "trip_items_select_own"
on public.trip_items for select to authenticated
using (
  exists (
    select 1 from public.trips
    where trips.id = trip_items.trip_id
      and trips.user_id = auth.uid()
  )
);

drop policy if exists "trip_items_insert_own" on public.trip_items;
create policy "trip_items_insert_own"
on public.trip_items for insert to authenticated
with check (
  exists (
    select 1 from public.trips
    where trips.id = trip_items.trip_id
      and trips.user_id = auth.uid()
  )
  and exists (
    select 1 from public.items
    where items.id = trip_items.item_id
      and items.user_id = auth.uid()
  )
);

drop policy if exists "trip_items_update_own" on public.trip_items;
create policy "trip_items_update_own"
on public.trip_items for update to authenticated
using (
  exists (
    select 1 from public.trips
    where trips.id = trip_items.trip_id
      and trips.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.trips
    where trips.id = trip_items.trip_id
      and trips.user_id = auth.uid()
  )
  and exists (
    select 1 from public.items
    where items.id = trip_items.item_id
      and items.user_id = auth.uid()
  )
);

drop policy if exists "trip_items_delete_own" on public.trip_items;
create policy "trip_items_delete_own"
on public.trip_items for delete to authenticated
using (
  exists (
    select 1 from public.trips
    where trips.id = trip_items.trip_id
      and trips.user_id = auth.uid()
  )
);
