# V2 Features

V2 extends Garde-robe with pricing, outfit persistence, dashboard stats, a wear calendar, and UI polish. See [roadmap.md](./roadmap.md) for milestone status.

## Item price and currency

- Optional `price` (decimal, max 2 places) and `currency_code` on each item (`items` table)
- Profile default currency (`profiles.currency_code`, default `EUR`) used when saving items with a price
- Supported currencies: USD, EUR, GBP, CAD, AUD, CHF, JPY, SEK, NOK, DKK
- Wardrobe grid shows formatted price when set

**Code:** [`src/lib/currency.ts`](../src/lib/currency.ts), item form/actions in [`src/lib/wardrobe/`](../src/lib/wardrobe/)

## Save and load outfits

- Name and save canvas compositions to `outfits` + `outfit_items`
- Optional `outfits.notes` and `outfits.cover_image_url` columns (UI deferred)
- List saved outfits at `/outfits`; edit at `/outfits/[id]`
- Delete saved outfits from list or edit page
- Items deleted from wardrobe are skipped on load (missing count shown)

**Code:** [`src/lib/outfit/`](../src/lib/outfit/), [`docs/outfit-builder.md](./outfit-builder.md)

## Dashboard stats

The dashboard at `/dashboard` shows:

| Stat | Definition |
|------|------------|
| Clothing items | Count of all `items` for the user |
| Saved outfits | Count of all `outfits` for the user |
| Wardrobe value | Sum of `items.price` where price is set and `currency_code` matches profile default |

Footnotes appear when items lack a price or use a different currency than the profile default (those items are excluded from the total).

**Code:** [`src/lib/dashboard/queries.ts`](../src/lib/dashboard/queries.ts)

## Outfit calendar

- Route: `/calendar`
- Month grid with prev/next navigation
- **One outfit per day** — assigning a new outfit replaces the existing entry for that date
- Dates stored as `scheduled_date` (`date`, YYYY-MM-DD); client sends the user’s local calendar date
- Optional `occasion` and `notes` on `outfit_calendar_entries` (UI deferred)
- Requires at least one saved outfit to assign

**Code:** [`src/lib/calendar/`](../src/lib/calendar/), migration [`20260315000005_v2_schema.sql`](../supabase/migrations/20260315000005_v2_schema.sql)

## UI polish

- Design tokens in [`src/app/globals.css`](../src/app/globals.css) (shadows, surfaces, motion easing)
- [Framer Motion](https://www.framer.com/motion/) for page fade-in, home card stagger, stat cards, item card hover, calendar modal
- Sticky blurred nav with active route indicator

## Applying V2 migrations

Run after existing v1 migrations (001–004). See [database-schema.md](./database-schema.md) for full list.

**Fresh install or not yet on V2:**

1. `supabase/migrations/20260315000005_v2_schema.sql`

**Already applied the former split migrations** (`item_price` + `outfit_calendar`):

1. `supabase/migrations/20260315000007_v2_schema_extensions.sql` only

Then deploy the app. Code that reads new columns or tables will fail until migrations are applied.

## Smoke test checklist

- [ ] Add item with price and currency; see price in wardrobe grid
- [ ] Build outfit, save with name, reopen from `/outfits/[id]`
- [ ] Dashboard shows item count, outfit count, wardrobe value
- [ ] Assign outfit to calendar day; replace and remove
- [ ] Nav links and animations work on desktop and mobile
