# Roadmap

Implementation milestones for v1. Each milestone builds on the previous one. Scope details are in [v1-scope.md](./v1-scope.md).

## Milestone 1: Project Setup

**Status:** Complete

**Goal:** Runnable Next.js app with project conventions in place.

**Deliverables:**

- [x] Next.js App Router scaffold with TypeScript (`src/app/`)
- [x] Tailwind CSS configured
- [x] ESLint and folder structure (`src/app/`, `src/components/`, `src/lib/`, `src/hooks/`)
- [x] Placeholder routes: `/`, `/login`, `/dashboard`, `/wardrobe`, `/outfits`
- [x] Shared layout with navigation
- [x] Supabase client stub and `.env.example` template
- [x] README updated to point to product docs

**Exit criteria:**

- [x] `npm run dev` runs without errors
- [x] Environment variable names documented for Supabase

---

## Milestone 2: Auth and Database

**Status:** Complete

**Goal:** User accounts and a secure data schema.

**Prep (complete):**

- [x] Supabase client setup (`src/lib/supabase/client.ts`, `server.ts`, `middleware.ts`)
- [x] Public env validation (`src/lib/env/public.ts`)
- [x] Session refresh middleware (`src/middleware.ts`)

**Deliverables:**

- [x] Supabase Auth with email/password sign-up and sign-in
- [x] Database schema — see [database-schema.md](./database-schema.md) (`profiles`, `categories`, `colors`, `brands`, `seasons`, `items`, `item_seasons`, `outfits`, `outfit_items`)
- [x] Row Level Security (RLS) policies — users can only access their own data
- [x] SQL migrations in `supabase/migrations/`

**Exit criteria:**

- [x] User can sign up, sign in, and sign out
- [ ] All tables reject queries from other users' accounts — apply migrations, then verify in Supabase (see [database-schema.md](./database-schema.md))

---

## Milestone 3: Wardrobe CRUD

**Status:** Complete

**Goal:** Full item lifecycle without images.

**Deliverables:**

- [x] Add-item form with metadata fields (name, category, color, brand, season/occasion tags)
- [x] Wardrobe list view (grid)
- [x] Filters by category, color, season, and brand
- [x] Edit and delete item flows

**Exit criteria:**

- [x] User can create, view, edit, and delete items end-to-end
- [x] Filters correctly narrow the wardrobe list

See [wardrobe-feature.md](./wardrobe-feature.md).

---

## Milestone 4: Image Upload

**Status:** Complete

**Goal:** Photos attached to wardrobe items.

**Deliverables:**

- [x] Supabase Storage bucket for item images
- [x] Upload on item create and edit
- [x] Image display in wardrobe list and item detail
- [x] Storage RLS — users can only read/write their own files

**Exit criteria:**

- [x] Items show photos in list and detail views
- [x] Uploaded images are not accessible by other users

See [storage.md](./storage.md).

---

## Milestone 5: Outfit Canvas

**Status:** Complete

**Goal:** Visual outfit builder with persistence.

**Deliverables:**

- [x] Canvas page with blank background — see [outfit-builder.md](./outfit-builder.md)
- [x] Wardrobe sidebar — click items onto the canvas
- [x] Resize, rotate, and reposition items on the canvas
- [x] Export composition as PNG
- [x] Save outfit with a name; load and reopen saved outfits
- [x] Persist item positions and scales in `outfit_items`

**Exit criteria:**

- [x] User can compose an outfit, save it, and reopen it with items in the same positions
- [x] Canvas is usable on tablet/desktop; acceptable fallback on mobile

See [outfit-builder.md](./outfit-builder.md) and [canvas-tech-decision.md](./canvas-tech-decision.md).

---

## V2: Pricing, Calendar, Stats, and UI Polish

**Status:** Complete

**Goal:** Extend the production app with V2 features documented in [v2-features.md](./v2-features.md).

### V2 features

- [x] Item price and currency on create/edit forms
- [x] Save, list, edit, and delete outfits
- [x] Collection summary at `/dashboard`: item count, outfit count, wardrobe value, category prose
- [x] Calendar view with one outfit per day

**Migrations:**

- `20260315000005_v2_schema.sql` (fresh install)
- `20260315000007_v2_schema_extensions.sql` (if upgrading from former split migrations)
- `20260315000008_default_currency_eur.sql` (profile default currency EUR)

### V2 UX and editorial polish

- [x] **Mobile-first UX** — 44px touch targets, bottom sheets, sticky action bars, focus routes hide tab bar, builder mobile layout
- [x] **Icon system** — centralized `src/lib/icons.ts`, `Icon` / `IconButton` wrappers
- [x] **Premium visual system** — warm tokens, Cormorant display type, hairline borders, no shadows
- [x] **Premium motion polish** — animated sheets, staggered grids, popovers; `prefers-reduced-motion` respected
- [x] **Editorial UI restraint** — de-dashboard collection page, photo grids for outfits, text-first filters, lighter nav, `.text-title` hierarchy

UI behavior details in [v2-features.md](./v2-features.md) — update that file's **UI polish** section in a follow-up if desired.

**Exit criteria:**

- [x] All V2 smoke tests in [v2-features.md](./v2-features.md) pass after migrations applied
- [x] Editorial collection page and lookbook grids ship on wardrobe/outfits
- [x] `npm run lint` and `npm run build` succeed

---

## Milestone 6: Deploy and QA

**Goal:** Production-ready v1 on Vercel.

**Deliverables:**

- [ ] Vercel deployment with Supabase env vars configured
- [ ] Smoke test all core flows on desktop and mobile
- [x] Document deployment and env vars — see [deployment.md](./deployment.md)

**Smoke test checklist (mobile 375px + desktop):**

- [ ] Add item, browse wardrobe photo grid, edit and delete item
- [ ] Filter "Refine" flow (mobile sheet; desktop compact row)
- [ ] Build outfit, save, reopen from `/outfits/[id]`
- [ ] Outfits lookbook grid
- [ ] Collection prose summary at `/dashboard`
- [ ] Calendar assign, replace, and remove outfit on a day
- [ ] Auth: sign up, sign in, sign out

**Exit criteria:**

- [ ] Live URL accessible
- [ ] Add item, browse wardrobe, build outfit, and auth flows work on phone and desktop

See [deployment.md](./deployment.md) for step-by-step Vercel setup.
