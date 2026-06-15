import Link from "next/link";
import { getItemTypeLabel } from "@/lib/i18n/item-types";
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
          Catégorie
        </label>
        <select
          id="category"
          name="category"
          defaultValue={filters.category ?? ""}
          className="input-field mt-1"
        >
          <option value="">Toutes les catégories</option>
          {lookups.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name} ({getItemTypeLabel(category.item_type)})
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[8rem] flex-1">
        <label htmlFor="color" className="input-label">
          Couleur
        </label>
        <select
          id="color"
          name="color"
          defaultValue={filters.color ?? ""}
          className="input-field mt-1"
        >
          <option value="">Toutes les couleurs</option>
          {lookups.colors.map((color) => (
            <option key={color.id} value={color.id}>
              {color.name}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[8rem] flex-1">
        <label htmlFor="season" className="input-label">
          Saison
        </label>
        <select
          id="season"
          name="season"
          defaultValue={filters.season ?? ""}
          className="input-field mt-1"
        >
          <option value="">Toutes les saisons</option>
          {lookups.seasons.map((season) => (
            <option key={season.id} value={season.id}>
              {season.name}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[8rem] flex-1">
        <label htmlFor="brand" className="input-label">
          Marque
        </label>
        <select
          id="brand"
          name="brand"
          defaultValue={filters.brand ?? ""}
          className="input-field mt-1"
        >
          <option value="">Toutes les marques</option>
          {lookups.brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4 pb-1">
        <button type="submit" className="btn-ghost text-sm">
          Appliquer
        </button>
        <Link href="/wardrobe" className="btn-ghost text-sm">
          Effacer
        </Link>
      </div>
    </form>
  );
}
