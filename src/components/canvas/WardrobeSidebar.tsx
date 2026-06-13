import type { WardrobeCanvasItem } from "@/lib/types/outfit";

type WardrobeSidebarProps = {
  items: WardrobeCanvasItem[];
  placedItemIds: Set<string>;
  onAddItem: (item: WardrobeCanvasItem) => void;
};

export function WardrobeSidebar({
  items,
  placedItemIds,
  onAddItem,
}: WardrobeSidebarProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-stone-300 bg-white p-4 text-sm text-stone-600">
        No wardrobe items with photos yet. Add items in your wardrobe first.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-stone-700">Wardrobe</p>
      <p className="text-xs text-stone-500">Click an item to add it to the canvas.</p>
      <ul className="grid grid-cols-2 gap-2">
        {items.map((item) => {
          const isPlaced = placedItemIds.has(item.id);

          return (
            <li key={item.id}>
              <button
                type="button"
                disabled={isPlaced}
                onClick={() => onAddItem(item)}
                className="w-full overflow-hidden rounded-md border border-stone-200 bg-white text-left disabled:cursor-not-allowed disabled:opacity-50 hover:border-stone-400 disabled:hover:border-stone-200"
              >
                <div className="aspect-square bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="block truncate px-2 py-1 text-xs text-stone-700">
                  {item.name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
