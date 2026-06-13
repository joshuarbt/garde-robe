import Link from "next/link";
import type { WardrobeFilters, WardrobeLookups } from "@/lib/types/item";

type WardrobeFiltersProps = {
  lookups: WardrobeLookups;
  filters: WardrobeFilters;
};

const selectClassName =
  "mt-1 block w-full rounded-sm border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-2 text-sm text-[var(--foreground)] focus:border-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]";

export function WardrobeFiltersBar({ lookups, filters }: WardrobeFiltersProps) {
  return (
    <form
      method="get"
      className="divider-hairline grid gap-4 pb-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      <div>
        <label htmlFor="category" className="label-caps">
          Category
        </label>
        <select
          id="category"
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
        <label htmlFor="color" className="label-caps">
          Color
        </label>
        <select
          id="color"
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
        <label htmlFor="season" className="label-caps">
          Season
        </label>
        <select
          id="season"
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
        <label htmlFor="brand" className="label-caps">
          Brand
        </label>
        <select
          id="brand"
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

      <div className="flex flex-wrap items-end gap-4 sm:col-span-2 lg:col-span-4">
        <button type="submit" className="btn-primary">
          Apply filters
        </button>
        <Link href="/wardrobe" className="btn-ghost">
          Clear filters
        </Link>
      </div>
    </form>
  );
}
