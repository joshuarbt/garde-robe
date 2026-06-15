"use client";

import Link from "next/link";
import { ItemImage } from "@/components/wardrobe/ItemImage";
import { formatPrice } from "@/lib/currency";
import { getItemTypeLabel } from "@/lib/i18n/item-types";
import type { ItemWithRelations } from "@/lib/types/item";

type ItemCardProps = {
  item: ItemWithRelations;
};

export function ItemCard({ item }: ItemCardProps) {
  return (
    <article>
      <Link href={`/wardrobe/${item.id}/edit`} className="block active:opacity-80">
        <div className="overflow-hidden bg-[var(--surface-muted)]">
          <ItemImage
            src={item.image_url}
            alt={item.name}
            className="aspect-[3/4] w-full object-cover"
          />
        </div>
        <div className="mt-4 space-y-1">
          <h2 className="text-heading leading-snug">{item.name}</h2>
          <p className="text-caption truncate">
            {[item.brand?.name, item.category?.name ?? getItemTypeLabel(item.item_type)]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {item.price !== null && item.currency_code ? (
            <p className="text-caption">{formatPrice(item.price, item.currency_code)}</p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
