"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { formatPrice } from "@/lib/currency";
import { revealProps } from "@/lib/motion";
import type { DashboardStats } from "@/lib/dashboard/queries";

type StatsCardsProps = {
  stats: DashboardStats;
};

export function StatsCards({ stats }: StatsCardsProps) {
  const reduced = useReducedMotion() ?? false;

  const cards = [
    {
      label: "Clothing items",
      value: String(stats.itemCount),
      footnote: null,
    },
    {
      label: "Saved outfits",
      value: String(stats.outfitCount),
      footnote: null,
    },
    {
      label: "Wardrobe value",
      value: formatPrice(stats.wardrobeValue, stats.profileCurrency),
      footnote:
        stats.itemsWithoutPrice > 0 || stats.itemsWithOtherCurrency > 0
          ? [
              stats.itemsWithoutPrice > 0
                ? `${stats.itemsWithoutPrice} item${stats.itemsWithoutPrice === 1 ? "" : "s"} without a price`
                : null,
              stats.itemsWithOtherCurrency > 0
                ? `${stats.itemsWithOtherCurrency} item${stats.itemsWithOtherCurrency === 1 ? "" : "s"} in other currencies excluded`
                : null,
            ]
              .filter(Boolean)
              .join(" · ")
          : null,
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          {...revealProps(reduced, index * 0.08)}
          className="border-t border-[var(--border-subtle)] pt-5"
        >
          <p className="label-caps">{card.label}</p>
          <p className="mt-3 font-display text-3xl tabular-nums text-[var(--foreground)]">
            {card.value}
          </p>
          {card.footnote ? (
            <p className="mt-3 text-xs text-stone-500">{card.footnote}</p>
          ) : null}
        </motion.div>
      ))}
    </div>
  );
}

type QuickLinksProps = {
  className?: string;
};

export function DashboardQuickLinks({ className }: QuickLinksProps) {
  const links = [
    { href: "/wardrobe", label: "Browse wardrobe" },
    { href: "/outfits", label: "View outfits" },
    { href: "/calendar", label: "Open calendar" },
  ];

  return (
    <div className={className}>
      <SectionLabel>Explore</SectionLabel>
      <p className="mt-3 text-sm text-[var(--muted)]">
        {links.map((link, index) => (
          <span key={link.href}>
            {index > 0 ? <span className="mx-2 text-stone-300">·</span> : null}
            <Link href={link.href} className="btn-ghost">
              {link.label}
            </Link>
          </span>
        ))}
      </p>
    </div>
  );
}
