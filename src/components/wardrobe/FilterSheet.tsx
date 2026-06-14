"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import type { WardrobeFilters, WardrobeLookups } from "@/lib/types/item";

type FilterSheetProps = {
  lookups: WardrobeLookups;
  filters: WardrobeFilters;
};

const selectClassName = "input-field mt-1";

export function FilterSheet({ lookups, filters }: FilterSheetProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const activeCount = [
    filters.category,
    filters.color,
    filters.season,
    filters.brand,
  ].filter(Boolean).length;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    for (const key of ["category", "color", "season", "brand"]) {
      const value = String(formData.get(key) ?? "").trim();
      if (value) {
        params.set(key, value);
      }
    }

    const query = params.toString();
    router.push(query ? `/wardrobe?${query}` : "/wardrobe");
    setOpen(false);
  }

  const refineLabel =
    activeCount > 0 ? `Refine (${activeCount})` : "Refine";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-ghost min-h-[var(--touch-min)] px-2 text-sm md:hidden"
      >
        {refineLabel}
      </button>

      <div className="md:hidden">
        <BottomSheet
          open={open}
          onClose={() => setOpen(false)}
          title="Refine"
          className="rounded-t-xl max-h-[85vh]"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="filter-category" className="input-label">
                Category
              </label>
              <select
                id="filter-category"
                name="category"
                defaultValue={filters.category ?? ""}
                className={selectClassName}
              >
                <option value="">All categories</option>
                {lookups.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.item_type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-color" className="input-label">
                Color
              </label>
              <select
                id="filter-color"
                name="color"
                defaultValue={filters.color ?? ""}
                className={selectClassName}
              >
                <option value="">All colors</option>
                {lookups.colors.map((color) => (
                  <option key={color.id} value={color.id}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-season" className="input-label">
                Season
              </label>
              <select
                id="filter-season"
                name="season"
                defaultValue={filters.season ?? ""}
                className={selectClassName}
              >
                <option value="">All seasons</option>
                {lookups.seasons.map((season) => (
                  <option key={season.id} value={season.id}>
                    {season.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-brand" className="input-label">
                Brand
              </label>
              <select
                id="filter-brand"
                name="brand"
                defaultValue={filters.brand ?? ""}
                className={selectClassName}
              >
                <option value="">All brands</option>
                {lookups.brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4 pt-2">
              <button type="submit" className="btn-ghost">
                Apply
              </button>
              <Link
                href="/wardrobe"
                className="btn-ghost text-[var(--muted)]"
                onClick={() => setOpen(false)}
              >
                Clear
              </Link>
            </div>
          </form>
        </BottomSheet>
      </div>
    </>
  );
}
