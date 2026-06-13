import Link from "next/link";
import type { WardrobeFilters, WardrobeLookups } from "@/lib/types/item";

type WardrobeFiltersProps = {
  lookups: WardrobeLookups;
  filters: WardrobeFilters;
};

const selectClassName =
  "mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500";

export function WardrobeFiltersBar({ lookups, filters }: WardrobeFiltersProps) {
  return (
    <form method="get" className="grid gap-4 rounded-lg border border-stone-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-stone-700">
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
        <label htmlFor="color" className="block text-sm font-medium text-stone-700">
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
        <label htmlFor="season" className="block text-sm font-medium text-stone-700">
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
        <label htmlFor="brand" className="block text-sm font-medium text-stone-700">
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

      <div className="flex flex-wrap items-end gap-3 sm:col-span-2 lg:col-span-4">
        <button
          type="submit"
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
        >
          Apply filters
        </button>
        <Link href="/wardrobe" className="text-sm text-stone-600 hover:text-stone-900">
          Clear filters
        </Link>
      </div>
    </form>
  );
}
