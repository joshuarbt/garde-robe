"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { fadeUp, motionTransition } from "@/lib/motion";
import type { WardrobeFilters, WardrobeLookups } from "@/lib/types/item";

type ActiveFilterChip = {
  key: keyof WardrobeFilters;
  label: string;
  value: string;
};

function buildActiveFilters(
  filters: WardrobeFilters,
  lookups: WardrobeLookups,
): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];

  if (filters.category) {
    const category = lookups.categories.find((entry) => entry.id === filters.category);
    chips.push({
      key: "category",
      label: category?.name ?? "Category",
      value: filters.category,
    });
  }

  if (filters.color) {
    const color = lookups.colors.find((entry) => entry.id === filters.color);
    chips.push({
      key: "color",
      label: color?.name ?? "Color",
      value: filters.color,
    });
  }

  if (filters.season) {
    const season = lookups.seasons.find((entry) => entry.id === filters.season);
    chips.push({
      key: "season",
      label: season?.name ?? "Season",
      value: filters.season,
    });
  }

  if (filters.brand) {
    const brand = lookups.brands.find((entry) => entry.id === filters.brand);
    chips.push({
      key: "brand",
      label: brand?.name ?? "Brand",
      value: filters.brand,
    });
  }

  return chips;
}

function buildClearHref(filters: WardrobeFilters, removeKey: keyof WardrobeFilters): string {
  const params = new URLSearchParams();

  if (filters.category && removeKey !== "category") {
    params.set("category", filters.category);
  }
  if (filters.color && removeKey !== "color") {
    params.set("color", filters.color);
  }
  if (filters.season && removeKey !== "season") {
    params.set("season", filters.season);
  }
  if (filters.brand && removeKey !== "brand") {
    params.set("brand", filters.brand);
  }

  const query = params.toString();
  return query ? `/wardrobe?${query}` : "/wardrobe";
}

type WardrobeFilterChipsProps = {
  filters: WardrobeFilters;
  lookups: WardrobeLookups;
  className?: string;
};

export function WardrobeFilterChips({
  filters,
  lookups,
  className = "",
}: WardrobeFilterChipsProps) {
  const reduced = useReducedMotion() ?? false;
  const chips = buildActiveFilters(filters, lookups);

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${className}`.trim()}>
      <AnimatePresence mode="popLayout">
        {chips.map((chip) => (
          <motion.div
            key={chip.key}
            layout={!reduced}
            initial={reduced ? false : "hidden"}
            animate={reduced ? undefined : "visible"}
            exit={reduced ? undefined : { opacity: 0 }}
            variants={reduced ? undefined : fadeUp}
            transition={motionTransition(reduced)}
          >
            <Link
              href={buildClearHref(filters, chip.key)}
              className="btn-ghost min-h-[var(--touch-min)] gap-1 text-sm"
              aria-label={`Remove ${chip.label} filter`}
            >
              {chip.label}
              <span aria-hidden className="text-[var(--muted)]">
                ×
              </span>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
      <Link href="/wardrobe" className="btn-ghost min-h-[var(--touch-min)] text-sm text-[var(--muted)]">
        Clear all
      </Link>
    </div>
  );
}
