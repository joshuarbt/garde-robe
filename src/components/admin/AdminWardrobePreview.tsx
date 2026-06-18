import { ItemImage } from "@/components/wardrobe/ItemImage";
import { OutfitPreview } from "@/components/outfits/OutfitPreview";
import type { ItemWithRelations } from "@/lib/types/item";
import type { OutfitSummary } from "@/lib/types/outfit";

type AdminWardrobePreviewProps = {
  items: ItemWithRelations[];
  outfits: OutfitSummary[];
};

export function AdminWardrobePreview({ items, outfits }: AdminWardrobePreviewProps) {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-title">Garde-robe ({items.length})</h3>
        {items.length === 0 ? (
          <p className="text-caption text-[var(--muted)]">Aucun article.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <li key={item.id} className="space-y-2">
                <div className="overflow-hidden bg-[var(--surface-muted)]">
                  <ItemImage
                    src={item.image_url}
                    alt={item.name}
                    className="aspect-[3/4] w-full object-cover"
                  />
                </div>
                <p className="text-sm">{item.name}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="text-title">Tenues ({outfits.length})</h3>
        {outfits.length === 0 ? (
          <p className="text-caption text-[var(--muted)]">Aucune tenue.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {outfits.map((outfit) => (
              <li key={outfit.id} className="space-y-2">
                <OutfitPreview
                  items={outfit.previewItems}
                  alt={outfit.name}
                  variant="card"
                  className="w-full"
                />
                <p className="text-sm">{outfit.name}</p>
                <p className="text-caption text-[var(--muted)]">
                  {outfit.itemCount} article{outfit.itemCount > 1 ? "s" : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
