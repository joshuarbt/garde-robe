import Link from "next/link";
import type { WardrobeFilters, WardrobeLookups } from "@/lib/types/item";

type WardrobeFiltersProps = {
  lookups: WardrobeLookups;
  filters: WardrobeFilters;
};

export function WardrobeFiltersBar({ lookups, filters }: WardrobeFiltersProps) {
  return (
    <form
      method="get"
      className="flex flex-wrap items-end gap-x-4 gap-y-3 pb-4"
    >
      <div className="min-w-[8rem] flex-1">
        <label htmlFor="category" className="input-label">
          Category
        </label>
        <select
          id="category"
          name="category"
          defaultValue={filters.category ?? ""}
          className="input-field mt-1"
        >
          <option value="">All categories</option>
          {lookups.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name} ({category.item_type})
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[8rem] flex-1">
        <label htmlFor="color" className="input-label">
          Color
        </label>
        <select
          id="color"
          name="color"
          defaultValue={filters.color ?? ""}
          className="input-field mt-1"
        >
          <option value="">All colors</option>
          {lookups.colors.map((color) => (
            <option key={color.id} value={color.id}>
              {color.name}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[8rem] flex-1">
        <label htmlFor="season" className="input-label">
          Season
        </label>
        <select
          id="season"
          name="season"
          defaultValue={filters.season ?? ""}
          className="input-field mt-1"
        >
          <option value="">All seasons</option>
          {lookups.seasons.map((season) => (
            <option key={season.id} value={season.id}>
              {season.name}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[8rem] flex-1">
        <label htmlFor="brand" className="input-label">
          Brand
        </label>
        <select
          id="brand"
          name="brand"
          defaultValue={filters.brand ?? ""}
          className="input-field mt-1"
        >
          <option value="">All brands</option>
          {lookups.brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4 pb-1">
        <button type="submit" className="btn-ghost text-sm">
          Apply
        </button>
        <Link href="/wardrobe" className="btn-ghost text-sm">
          Clear
        </Link>
      </div>
    </form>
  );
}
