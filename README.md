# Garde-robe

Personal wardrobe manager — catalog clothing, accessories, and jewelry with photos and filters, compose outfits on a Konva canvas, save looks, plan wear days on a calendar, and review your collection summary. See [docs/product.md](docs/product.md) for user flows.

Product docs:

- [docs/product.md](docs/product.md) — vision and user flows
- [docs/v1-scope.md](docs/v1-scope.md) — MVP boundaries
- [docs/roadmap.md](docs/roadmap.md) — implementation milestones
- [docs/v2-features.md](docs/v2-features.md) — pricing, calendar, collection, UI notes
- [docs/auth.md](docs/auth.md) — authentication setup and flow
- [docs/database-schema.md](docs/database-schema.md) — database schema and migrations
- [docs/wardrobe-feature.md](docs/wardrobe-feature.md) — wardrobe CRUD routes and flows
- [docs/storage.md](docs/storage.md) — item image upload and Supabase Storage setup
- [docs/image-processing.md](docs/image-processing.md) — background removal architecture (future)
- [docs/canvas-tech-decision.md](docs/canvas-tech-decision.md) — outfit canvas library comparison and MVP scope
- [docs/outfit-builder.md](docs/outfit-builder.md) — outfit builder routes, components, and QA checklist
- [docs/deployment.md](docs/deployment.md) — Vercel deployment and environment variables

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 App Router, TypeScript, Tailwind CSS v4 |
| Backend | Supabase (auth, Postgres, Storage) |
| Canvas | Konva + react-konva |
| Motion | Framer Motion (`src/lib/motion.ts`, reduced-motion safe) |
| Icons | Lucide via shared `Icon` / `src/lib/icons.ts` |
| Typography | Geist Sans + Cormorant Garamond (display) |
| Deploy | Vercel (Milestone 6) |

## Routes

Authenticated app routes:

| Route | Purpose |
|-------|---------|
| `/wardrobe` | Photo grid + filters |
| `/wardrobe/new` | Add item |
| `/wardrobe/[id]/edit` | Edit item |
| `/outfits` | Lookbook grid |
| `/outfits/new` | Outfit builder (focus layout) |
| `/outfits/[id]` | View/edit saved look |
| `/calendar` | Month grid; assign one outfit per day |
| `/dashboard` | "Your collection" prose summary |
| `/login`, `/signup` | Auth |

Mobile uses a bottom tab bar and sticky header. Builder and edit routes hide the tab bar (focus routes).

## Design system

Tokens and utilities live in [`src/app/globals.css`](src/app/globals.css) (`--space-*`, `.text-display`, `.text-title`, `.btn-*`). The UI is editorial: photo-first grids, prose collection summary, minimal chrome. Motion primitives are in [`src/lib/motion.ts`](src/lib/motion.ts) and [`src/components/layout/motion.tsx`](src/components/layout/motion.tsx).

## Getting Started

Install dependencies:

```bash
npm install
```

### Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Open **Project Settings → API**
3. Copy the **Project URL** and **publishable** (anon) key
4. Configure local environment:

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Where used | Notes |
|----------|------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server Supabase clients | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser + server Supabase clients | Publishable key; safe in browser when RLS is enabled |

**Never expose in client code:** secret keys (e.g. service role key), database connection strings, or any env var without the `NEXT_PUBLIC_` prefix.

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Placeholder pages run without Supabase configured. Auth and middleware require both env vars — see [docs/auth.md](docs/auth.md).

## Project Structure

```
src/
├── app/                    # App Router pages + globals.css (design tokens)
├── components/
│   ├── auth/               # Login, signup, sign out
│   ├── calendar/           # Grid, assign modal
│   ├── canvas/             # Outfit builder (Konva)
│   ├── dashboard/          # Collection stats + category prose
│   ├── layout/             # AppNav, PageShell, MobileTabBar, motion helpers
│   ├── outfits/            # OutfitCard, OutfitsList
│   ├── ui/                 # BottomSheet, EmptyState, Icon, IconButton
│   └── wardrobe/           # ItemCard, filters, AnimatedItemGrid
├── hooks/                  # e.g. useIsDesktop
├── lib/
│   ├── auth/, calendar/, dashboard/, outfit/, wardrobe/
│   ├── icons.ts, motion.ts, currency.ts
│   └── supabase/           # Browser, server, middleware clients
└── middleware.ts           # Supabase session refresh (when env is configured)
```

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```
