-- Row Level Security policies for Garde-robe

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "profiles_delete_own"
on public.profiles
for delete
to authenticated
using (id = auth.uid());

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------

alter table public.categories enable row level security;

create policy "categories_select_own"
on public.categories
for select
to authenticated
using (user_id = auth.uid());

create policy "categories_insert_own"
on public.categories
for insert
to authenticated
with check (user_id = auth.uid());

create policy "categories_update_own"
on public.categories
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "categories_delete_own"
on public.categories
for delete
to authenticated
using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- brands
-- ---------------------------------------------------------------------------

alter table public.brands enable row level security;

create policy "brands_select_own"
on public.brands
for select
to authenticated
using (user_id = auth.uid());

create policy "brands_insert_own"
on public.brands
for insert
to authenticated
with check (user_id = auth.uid());

create policy "brands_update_own"
on public.brands
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "brands_delete_own"
on public.brands
for delete
to authenticated
using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- colors (global read-only)
-- ---------------------------------------------------------------------------

alter table public.colors enable row level security;

create policy "colors_select_authenticated"
on public.colors
for select
to authenticated
using (true);

-- ---------------------------------------------------------------------------
-- seasons (global read-only)
-- ---------------------------------------------------------------------------

alter table public.seasons enable row level security;

create policy "seasons_select_authenticated"
on public.seasons
for select
to authenticated
using (true);

-- ---------------------------------------------------------------------------
-- items
-- ---------------------------------------------------------------------------

alter table public.items enable row level security;

create policy "items_select_own"
on public.items
for select
to authenticated
using (user_id = auth.uid());

create policy "items_insert_own"
on public.items
for insert
to authenticated
with check (user_id = auth.uid());

create policy "items_update_own"
on public.items
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "items_delete_own"
on public.items
for delete
to authenticated
using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- item_seasons
-- ---------------------------------------------------------------------------

alter table public.item_seasons enable row level security;

create policy "item_seasons_select_own"
on public.item_seasons
for select
to authenticated
using (
  exists (
    select 1
    from public.items
    where items.id = item_seasons.item_id
      and items.user_id = auth.uid()
  )
);

create policy "item_seasons_insert_own"
on public.item_seasons
for insert
to authenticated
with check (
  exists (
    select 1
    from public.items
    where items.id = item_seasons.item_id
      and items.user_id = auth.uid()
  )
);

create policy "item_seasons_delete_own"
on public.item_seasons
for delete
to authenticated
using (
  exists (
    select 1
    from public.items
    where items.id = item_seasons.item_id
      and items.user_id = auth.uid()
  )
);

-- ---------------------------------------------------------------------------
-- outfits
-- ---------------------------------------------------------------------------

alter table public.outfits enable row level security;

create policy "outfits_select_own"
on public.outfits
for select
to authenticated
using (user_id = auth.uid());

create policy "outfits_insert_own"
on public.outfits
for insert
to authenticated
with check (user_id = auth.uid());

create policy "outfits_update_own"
on public.outfits
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "outfits_delete_own"
on public.outfits
for delete
to authenticated
using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- outfit_items
-- ---------------------------------------------------------------------------

alter table public.outfit_items enable row level security;

create policy "outfit_items_select_own"
on public.outfit_items
for select
to authenticated
using (
  exists (
    select 1
    from public.outfits
    where outfits.id = outfit_items.outfit_id
      and outfits.user_id = auth.uid()
  )
);

create policy "outfit_items_insert_own"
on public.outfit_items
for insert
to authenticated
with check (
  exists (
    select 1
    from public.outfits
    where outfits.id = outfit_items.outfit_id
      and outfits.user_id = auth.uid()
  )
  and exists (
    select 1
    from public.items
    where items.id = outfit_items.item_id
      and items.user_id = auth.uid()
  )
);

create policy "outfit_items_update_own"
on public.outfit_items
for update
to authenticated
using (
  exists (
    select 1
    from public.outfits
    where outfits.id = outfit_items.outfit_id
      and outfits.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.outfits
    where outfits.id = outfit_items.outfit_id
      and outfits.user_id = auth.uid()
  )
  and exists (
    select 1
    from public.items
    where items.id = outfit_items.item_id
      and items.user_id = auth.uid()
  )
);

create policy "outfit_items_delete_own"
on public.outfit_items
for delete
to authenticated
using (
  exists (
    select 1
    from public.outfits
    where outfits.id = outfit_items.outfit_id
      and outfits.user_id = auth.uid()
  )
);
