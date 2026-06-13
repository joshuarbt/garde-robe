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

**Goal:** Visual outfit builder with persistence.

**Deliverables:**

- Canvas page with blank background
- Wardrobe sidebar — drag items onto the canvas
- Resize and reposition items on the canvas
- Save outfit with a name; load and reopen saved outfits
- Persist item positions and scales in `outfit_items`

**Exit criteria:**

- User can compose an outfit, save it, and reopen it with items in the same positions
- Canvas is usable on tablet/desktop; acceptable fallback on mobile

---

## Milestone 6: Deploy and QA

**Goal:** Production-ready v1 on Vercel.

**Deliverables:**

- Vercel deployment with Supabase env vars configured
- Smoke test all core flows on desktop and mobile
- Document known issues and limitations

**Exit criteria:**

- Live URL accessible
- Add item, browse wardrobe, build outfit, and auth flows work on phone and desktop
