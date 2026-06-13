# Canvas Technology Decision

Technical comparison of **Fabric.js** and **Konva** for Garde-robe's outfit composition feature (Milestone 5). No canvas code exists yet — this document records the decision before implementation.

Related docs: [roadmap.md](./roadmap.md) (Milestone 5), [v1-scope.md](./v1-scope.md), [database-schema.md](./database-schema.md) (`outfit_items`), [product.md](./product.md).

## Context and Requirements

Garde-robe users compose outfits by placing wardrobe item photos on a blank canvas. The app already defines persistence in Postgres:

| Requirement | Notes |
|-------------|-------|
| Blank canvas | White or transparent background; no scenes or templates in v1 |
| Drag wardrobe items | Sidebar thumbnails → canvas; typically 5–15 images per outfit |
| Resize / rotate | Maps to `outfit_items.scale`, `rotation` |
| Layer ordering | Maps to `outfit_items.z_index` |
| Mobile | Tablet/desktop primary; simplified fallback on phone per [product.md](./product.md) |
| Export PNG | Download final composition as an image |
| Save / load | Persist per-item placements in `outfit_items` — not raw canvas JSON |

Stack constraints:

- Next.js 16 App Router, React 19, TypeScript
- Canvas is client-only (SSR incompatible)
- Item photos loaded from Supabase Storage signed URLs (see [storage.md](./storage.md))
- Placement type: [`CanvasItemPlacement`](../src/lib/types/outfit.ts) ↔ `outfit_items` rows

## Comparison

| Criterion | Fabric.js | Konva (react-konva) |
|-----------|-----------|---------------------|
| React / Next.js fit | Imperative canvas ref; community wrappers (`fabricjs-react`); manual sync with React state | Native React bindings (`Stage`, `Layer`, `Image`, `Transformer`) |
| Drag-and-drop items | Strong; `fabric.Image` with built-in controls | Strong; `Konva.Image` with `draggable` |
| Resize / rotate | Built-in controls, `UniformScaling` options | `Konva.Transformer` attached to selected node |
| Layer ordering | `bringForward`, `sendBackwards`, object stack order | `zIndex`, `moveToTop`, `moveToBottom` on nodes |
| Touch / mobile | Usable; Fabric 6 improved touch, but historically weaker on phones | Generally smoother touch drag; common choice for interactive mobile web |
| Export to image | `canvas.toDataURL()` / `toBlob()` | `stage.toDataURL()` / `toBlob()` |
| Save / load | Mature `toJSON()` / `loadFromJSON()` | `stage.toJSON()` / `Konva.Node.create()` |
| Fit with **our** DB model | Canvas JSON is object-centric; still need custom mapper to `outfit_items` | Node props map 1:1 to x, y, scale, rotation, zIndex — cleaner fit |
| Bundle size | ~300 KB+ (`fabric` package) | `konva` + `react-konva` (similar order of magnitude) |
| TypeScript | Good in Fabric 6 | Good official types |
| Learning curve for MVP | Higher React integration overhead | Lower for this stack |
| Main risk | Fighting React lifecycle; mobile edge cases | SSR requires dynamic import + `'use client'`; Transformer is single-selection by default (fine for MVP) |

## Recommendation: Konva (via react-konva)

**Use Konva with the `react-konva` bindings** for the outfit canvas.

### Why Konva fits Garde-robe

1. **Stack alignment** — The app is React-first. `react-konva` matches how components in `src/components/` are organized. Fabric expects an imperative canvas instance managed largely outside the React render cycle.

2. **Data model fit** — `outfit_items` stores `position_x`, `position_y`, `scale`, `rotation`, and `z_index` per item. Konva image nodes expose the same properties. Saving an outfit means reading node state and upserting rows — not storing opaque canvas JSON.

3. **MVP interactions** — `Konva.Transformer` provides resize handles and rotation for the selected clothing image with minimal code. Fabric's broader design-tool features (paths, text, filters, complex groups) are out of v1 scope.

4. **Mobile** — Product targets tablet/desktop for composition. Konva's touch drag behavior is well suited to "drag clothing photos around" and is widely documented for interactive web apps.

5. **Export** — `stage.toDataURL({ pixelRatio: 2 })` produces a PNG without additional libraries.

6. **Future save/load** — Loading a saved outfit: fetch `outfit_items` + wardrobe image URLs, instantiate one `Konva.Image` per row. No lock-in to library-specific serialization.

### When Fabric would be better

Choose Fabric if a future version needed a full design editor: freehand drawing, masking, SVG import, rich grouping, or image filters. Those are explicitly excluded from v1 in [v1-scope.md](./v1-scope.md).

## Tradeoffs

### Konva downsides we accept

- **Client-only loading** — Canvas components must use `'use client'` and typically `dynamic(..., { ssr: false })`. Standard for any canvas library.
- **No built-in layers panel or undo/redo** — v1 excludes these; implement simple "bring forward" / "send back" buttons instead of a full layers UI.
- **Peer dependency check** — Verify `react-konva` compatibility with React 19 at install time.

### Fabric downsides we avoid

- **React glue code** — More boilerplate to keep Fabric object state in sync with React for a simple photo collager.
- **Serialization mismatch** — Fabric's `toJSON()` snapshot is canvas-centric; we still need a custom mapper to normalized `outfit_items` rows.

## Implementation Notes

These notes guide Milestone 5 implementation. Nothing here is built yet.

### Component structure

```tsx
'use client';
// dynamic import OutfitCanvas to avoid SSR

<Stage width={...} height={...}>  {/* fixed aspect ratio, e.g. 4:5 */}
  <Layer>
    {placements.map(... =>
      <Image key={itemId} image={htmlImage} x y scaleX scaleY rotation draggable />
    )}
    <Transformer ref={transformerRef} />  {/* attached to selected node */}
  </Layer>
</Stage>
```

### Images

- Load wardrobe photos from signed Supabase URLs (same host already allowed in `next.config.ts` for `next/image`).
- For PNG export, set `crossOrigin = 'anonymous'` on image loads so `toDataURL()` is not tainted. Confirm CORS headers from Supabase Storage if export fails in testing.

### Sidebar drag-and-drop

- **Desktop/tablet:** HTML drag from wardrobe sidebar → drop on canvas stage → create new `Konva.Image` at drop coordinates.
- **Mobile fallback:** Tap item in sidebar to add at canvas center; view-only or limited editing on small screens.

### Persistence

On save, read each canvas image node and map to:

```ts
{ itemId, x, y, scale, rotation, zIndex }
```

Upsert into `outfit_items` via server actions. On load, reverse: query outfit + items, hydrate nodes from DB rows.

### Layer ordering

MVP: toolbar buttons **Bring forward** / **Send back** that adjust `zIndex` on the selected node. No layers panel.

### Export

Toolbar button → `stage.toDataURL({ pixelRatio: 2 })` → trigger browser download. Optional stretch goal once the canvas exists.

### Mobile strategy

| Viewport | Behavior |
|----------|----------|
| ≥ 768px (tablet/desktop) | Full canvas editor: drag, resize, rotate, layer controls |
| < 768px (phone) | Simplified: view saved outfit and/or tap-to-add; defer precise editing |

## MVP Scope

### In scope (Milestone 5)

- `/outfits` list and `/outfits/[id]` or `/outfits/new` canvas page
- Wardrobe sidebar (user items with photos)
- Add item to canvas (drag or tap)
- Drag to reposition; resize and rotate via `Konva.Transformer`
- Bring forward / send back (z-index)
- Save outfit name and placements to `outfits` / `outfit_items`
- Load saved outfit and restore positions
- Remove item from canvas

### MVP stretch (low cost once canvas exists)

- Export current composition as PNG

### Explicitly deferred

Per [v1-scope.md](./v1-scope.md):

- Layers panel, undo/redo, templates, background scenes
- Multi-select, grouping, snap-to-grid
- Processed (background-removed) images on canvas — see [image-processing.md](./image-processing.md)

## Next Steps (future work)

1. Install `konva` and `react-konva`; confirm React 19 peer deps.
2. Scaffold `src/components/canvas/` (e.g. `OutfitCanvas`, `WardrobeSidebar`, `CanvasToolbar`).
3. Add outfit queries/actions for `outfits` and `outfit_items`.
4. Wire `/outfits` routes with dynamic client import.
5. Manual test on desktop, tablet, and phone fallback.

Do not start these steps until Milestone 5 implementation is scheduled.
