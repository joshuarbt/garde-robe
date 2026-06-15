"use client";

import { formatPrice } from "@/lib/currency";
import type { DashboardStats } from "@/lib/dashboard/queries";
import { formatCount } from "@/lib/i18n/plural";

type StatsCardsProps = {
  stats: DashboardStats;
};

export function StatsCards({ stats }: StatsCardsProps) {
  const footnotes = [
    stats.itemsWithoutPrice > 0
      ? formatCount(stats.itemsWithoutPrice, "vêtement sans prix", "vêtements sans prix")
      : null,
    stats.itemsWithOtherCurrency > 0
      ? formatCount(
          stats.itemsWithOtherCurrency,
          "vêtement dans une autre devise exclu",
          "vêtements dans d'autres devises exclus",
        )
      : null,
  ].filter(Boolean);

  return (
    <div className="space-y-3">
      <p className="font-display text-display text-[var(--foreground)]">
        {formatCount(stats.itemCount, "vêtement", "vêtements")}
        <span className="text-[var(--muted-light)]"> · </span>
        {formatCount(stats.outfitCount, "tenue", "tenues")}
        <span className="text-[var(--muted-light)]"> · </span>
        {formatPrice(stats.wardrobeValue, stats.profileCurrency)}
      </p>

      {footnotes.length > 0 ? (
        <p className="text-caption text-[var(--muted-light)]">{footnotes.join(" · ")}</p>
      ) : null}
    </div>
  );
}
