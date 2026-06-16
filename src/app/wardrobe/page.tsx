import { redirect } from "next/navigation";
import { ItemList } from "@/components/wardrobe/ItemList";
import { FilterSheet } from "@/components/wardrobe/FilterSheet";
import { WardrobeAddAction } from "@/components/wardrobe/WardrobeAddAction";
import { WardrobeFilterChips } from "@/components/wardrobe/WardrobeFilterChips";
import { WardrobeFiltersBar } from "@/components/wardrobe/WardrobeFilters";
import { PageShell } from "@/components/layout/PageShell";
import { EmptyState } from "@/components/ui/EmptyState";
import type { WardrobeFilters } from "@/lib/types/item";
import { getItems, getWardrobeLookups } from "@/lib/wardrobe/queries";
import { createClient } from "@/lib/supabase/server";

type WardrobePageProps = {
  searchParams: Promise<{
    category?: string;
    color?: string;
    season?: string;
    brand?: string;
  }>;
};

export default async function WardrobePage({ searchParams }: WardrobePageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const filters: WardrobeFilters = {
    category: params.category,
    color: params.color,
    season: params.season,
    brand: params.brand,
  };

  const [lookups, items] = await Promise.all([
    getWardrobeLookups(),
    getItems(filters),
  ]);

  const hasActiveFilters =
    Boolean(params.category) ||
    Boolean(params.color) ||
    Boolean(params.season) ||
    Boolean(params.brand);

  const pieceLabel = `${items.length} pièce${items.length === 1 ? "" : "s"}`;

  return (
    <PageShell
      title="Garde-robe"
      subtitle={pieceLabel}
      wide
      actionsAlign="baseline"
      actions={
        <div className="flex items-center gap-2">
          {(items.length > 0 || hasActiveFilters) && (
            <FilterSheet lookups={lookups} filters={filters} />
          )}
          <WardrobeAddAction />
        </div>
      }
    >
      {hasActiveFilters ? (
        <WardrobeFilterChips
          lookups={lookups}
          filters={filters}
          className="mb-6 md:hidden"
        />
      ) : null}

      {(items.length > 0 || hasActiveFilters) && (
        <div className="mb-8 hidden md:block">
          <WardrobeFiltersBar lookups={lookups} filters={filters} />
          {hasActiveFilters ? (
            <WardrobeFilterChips lookups={lookups} filters={filters} className="mt-3" />
          ) : null}
        </div>
      )}

      {items.length === 0 && !hasActiveFilters ? (
        <EmptyState
          message="Votre garde-robe est vide."
          actionLabel="Ajouter votre première pièce"
          actionHref="/wardrobe/new"
        />
      ) : (
        <ItemList items={items} />
      )}
    </PageShell>
  );
}
