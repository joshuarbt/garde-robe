-- V2 schema: item price, outfit metadata, calendar scheduling, profile currency
-- Consolidates former 20260315000005_item_price.sql and 20260315000006_outfit_calendar.sql

-- Profile default currency (wardrobe value stats)
alter table public.profiles
  add column if not exists currency_code char(3) not null default 'USD';

-- Item price (optional; existing rows stay null)
alter table public.items
  add column if not exists price numeric(10, 2) null
    check (price is null or price >= 0),
  add column if not exists currency_code char(3) null;

-- Outfit metadata extensions
alter table public.outfits
  add column if not exists notes text null,
  add column if not exists cover_image_url text null;

-- Calendar: one outfit per user per day
create table if not exists public.outfit_calendar_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  outfit_id uuid not null references public.outfits (id) on delete cascade,
  scheduled_date date not null,
  occasion text null,
  notes text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, scheduled_date)
);

alter table public.outfit_calendar_entries
  add column if not exists occasion text null,
  add column if not exists notes text null;

create index if not exists outfit_calendar_entries_user_id_idx
  on public.outfit_calendar_entries (user_id);

create index if not exists outfit_calendar_entries_user_id_scheduled_date_idx
  on public.outfit_calendar_entries (user_id, scheduled_date);

drop trigger if exists outfit_calendar_entries_set_updated_at on public.outfit_calendar_entries;

create trigger outfit_calendar_entries_set_updated_at
before update on public.outfit_calendar_entries
for each row
execute function public.set_updated_at();

alter table public.outfit_calendar_entries enable row level security;

drop policy if exists "outfit_calendar_entries_select_own" on public.outfit_calendar_entries;
create policy "outfit_calendar_entries_select_own"
on public.outfit_calendar_entries
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "outfit_calendar_entries_insert_own" on public.outfit_calendar_entries;
create policy "outfit_calendar_entries_insert_own"
on public.outfit_calendar_entries
for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.outfits
    where outfits.id = outfit_calendar_entries.outfit_id
      and outfits.user_id = auth.uid()
  )
);

drop policy if exists "outfit_calendar_entries_update_own" on public.outfit_calendar_entries;
create policy "outfit_calendar_entries_update_own"
on public.outfit_calendar_entries
for update
to authenticated
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.outfits
    where outfits.id = outfit_calendar_entries.outfit_id
      and outfits.user_id = auth.uid()
  )
);

drop policy if exists "outfit_calendar_entries_delete_own" on public.outfit_calendar_entries;
create policy "outfit_calendar_entries_delete_own"
on public.outfit_calendar_entries
for delete
to authenticated
using (user_id = auth.uid());
