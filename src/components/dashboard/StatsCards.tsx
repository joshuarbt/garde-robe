"use client";

import { formatPrice } from "@/lib/currency";
import type { DashboardStats } from "@/lib/dashboard/queries";

type StatsCardsProps = {
  stats: DashboardStats;
};

export function StatsCards({ stats }: StatsCardsProps) {
  const footnotes = [
    stats.itemsWithoutPrice > 0
      ? `${stats.itemsWithoutPrice} piece${stats.itemsWithoutPrice === 1 ? "" : "s"} without a price`
      : null,
    stats.itemsWithOtherCurrency > 0
      ? `${stats.itemsWithOtherCurrency} piece${stats.itemsWithOtherCurrency === 1 ? "" : "s"} in other currencies excluded`
      : null,
  ].filter(Boolean);

  return (
    <div className="space-y-3">
      <p className="font-display text-display text-[var(--foreground)]">
        {stats.itemCount} piece{stats.itemCount === 1 ? "" : "s"}
        <span className="text-[var(--muted-light)]"> · </span>
        {stats.outfitCount} look{stats.outfitCount === 1 ? "" : "s"}
        <span className="text-[var(--muted-light)]"> · </span>
        {formatPrice(stats.wardrobeValue, stats.profileCurrency)}
      </p>

      {footnotes.length > 0 ? (
        <p className="text-caption text-[var(--muted-light)]">{footnotes.join(" · ")}</p>
      ) : null}
    </div>
  );
}
