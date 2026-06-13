"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ItemImage } from "@/components/wardrobe/ItemImage";
import { formatPrice } from "@/lib/currency";
import type { ItemWithRelations } from "@/lib/types/item";

type ItemCardProps = {
  item: ItemWithRelations;
};

export function ItemCard({ item }: ItemCardProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.article layout className="group">
      <Link href={`/wardrobe/${item.id}/edit`} className="block">
        <div className="overflow-hidden bg-[var(--surface-muted)]">
          <ItemImage
            src={item.image_url}
            alt={item.name}
            className={`aspect-square w-full ${
              reduced ? "" : "transition-transform duration-300 group-hover:scale-[1.02]"
            }`}
          />
        </div>
        <div className="mt-4 space-y-1">
          {item.category ? (
            <p className="label-caps">{item.category.name}</p>
          ) : (
            <p className="label-caps">{item.item_type}</p>
          )}
          <h2 className="font-medium text-[var(--foreground)]">{item.name}</h2>
          {item.brand ? (
            <p className="text-sm text-[var(--muted)]">{item.brand.name}</p>
          ) : null}
          {item.price !== null && item.currency_code ? (
            <p className="text-sm tabular-nums text-stone-500">
              {formatPrice(item.price, item.currency_code)}
            </p>
          ) : null}
        </div>
      </Link>
    </motion.article>
  );
}
