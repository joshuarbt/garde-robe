import type { ItemWithRelations } from "@/lib/types/item";
import { ItemCard } from "@/components/wardrobe/ItemCard";

type ItemListProps = {
  items: ItemWithRelations[];
};

export function ItemList({ items }: ItemListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center">
        <p className="text-stone-600">No items match your filters.</p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.id}>
          <ItemCard item={item} />
        </li>
      ))}
    </ul>
  );
}
