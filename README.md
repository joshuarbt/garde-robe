# Garde-robe

Personal wardrobe manager — catalog clothing, accessories, and jewelry, then compose outfits on a visual canvas.

Product docs:

- [docs/product.md](docs/product.md) — vision and user flows
- [docs/v1-scope.md](docs/v1-scope.md) — MVP boundaries
- [docs/roadmap.md](docs/roadmap.md) — implementation milestones
- [docs/auth.md](docs/auth.md) — authentication setup and flow
- [docs/database-schema.md](docs/database-schema.md) — database schema and migrations
- [docs/wardrobe-feature.md](docs/wardrobe-feature.md) — wardrobe CRUD routes and flows
- [docs/storage.md](docs/storage.md) — item image upload and Supabase Storage setup
- [docs/image-processing.md](docs/image-processing.md) — background removal architecture (future)

## Stack

- Next.js App Router (TypeScript)
- Tailwind CSS
- Supabase (auth, database, storage)
- Vercel (deployment — Milestone 6)

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
├── app/              # Routes and layouts
├── components/       # UI components (layout/, canvas/)
├── hooks/            # Client-side hooks
├── lib/
│   ├── env/          # Environment variable validation
│   └── supabase/     # Browser, server, and middleware clients
└── middleware.ts     # Supabase session refresh (when env is configured)
```

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```
