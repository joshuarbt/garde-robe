import Link from "next/link";
import { ItemImage } from "@/components/wardrobe/ItemImage";
import type { ItemWithRelations } from "@/lib/types/item";

type ItemCardProps = {
  item: ItemWithRelations;
};

export function ItemCard({ item }: ItemCardProps) {
  const seasonNames = item.seasons.map((season) => season.name).join(", ");

  return (
    <article className="overflow-hidden rounded-lg border border-stone-200 bg-white">
      <ItemImage
        src={item.image_url}
        alt={item.name}
        className="aspect-square w-full"
      />
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-medium text-stone-900">{item.name}</h2>
          <span className="shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-xs capitalize text-stone-600">
            {item.item_type}
          </span>
        </div>
        <dl className="space-y-1 text-sm text-stone-600">
          {item.category ? (
            <div>
              <dt className="sr-only">Category</dt>
              <dd>{item.category.name}</dd>
            </div>
          ) : null}
          {item.color ? (
            <div className="flex items-center gap-2">
              <dt className="sr-only">Color</dt>
              <dd className="flex items-center gap-2">
                {item.color.hex_code ? (
                  <span
                    className="inline-block h-3 w-3 rounded-full border border-stone-200"
                    style={{ backgroundColor: item.color.hex_code }}
                  />
                ) : null}
                {item.color.name}
              </dd>
            </div>
          ) : null}
          {item.brand ? (
            <div>
              <dt className="sr-only">Brand</dt>
              <dd>{item.brand.name}</dd>
            </div>
          ) : null}
          {seasonNames ? (
            <div>
              <dt className="sr-only">Seasons</dt>
              <dd>{seasonNames}</dd>
            </div>
          ) : null}
        </dl>
        <Link
          href={`/wardrobe/${item.id}/edit`}
          className="inline-block text-sm font-medium text-stone-900 hover:underline"
        >
          Edit
        </Link>
      </div>
    </article>
  );
}
