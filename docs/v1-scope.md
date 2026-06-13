# v1 Scope

Hard boundaries for the MVP. See [product.md](./product.md) for full product context.

## Included in MVP

- Email/password auth via Supabase (single user, private data)
- Add, edit, and delete wardrobe items (clothing, accessories, jewelry)
- Item fields: name, category, color, brand, season/occasion tags, one image
- Wardrobe list with basic filters (category, season/occasion)
- Image upload to Supabase Storage
- Outfit canvas: blank background, drag items from wardrobe, resize/reposition, save outfit with name
- Responsive layout — mobile-friendly wardrobe browsing; canvas usable on tablet/desktop, simplified on small screens if needed
- Deploy to Vercel with Supabase environment variables configured

## Explicitly Excluded from MVP

- Background removal
- Multi-user accounts, sharing, or public profiles
- Wear tracking, analytics, or purchase history fields
- Bulk import or export
- AI features
- Offline mode
- Native mobile app
- Advanced canvas features (layers panel, undo/redo stack, templates, background scenes)
- Payment or subscriptions
