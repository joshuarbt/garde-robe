import Link from "next/link";
import { redirect } from "next/navigation";
import { ItemList } from "@/components/wardrobe/ItemList";
import { FilterSheet } from "@/components/wardrobe/FilterSheet";
import { WardrobeFilterChips } from "@/components/wardrobe/WardrobeFilterChips";
import { WardrobeFiltersBar } from "@/components/wardrobe/WardrobeFilters";
import { PageShell } from "@/components/layout/PageShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconLink } from "@/components/ui/IconButton";
import { actionIcons } from "@/lib/icons";
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

  const pieceLabel = `${items.length} piece${items.length === 1 ? "" : "s"}`;

  return (
    <PageShell
      title="Wardrobe"
      subtitle={pieceLabel}
      wide
      actionsAlign="baseline"
      actions={
        <div className="flex items-center gap-2">
          {(items.length > 0 || hasActiveFilters) && (
            <FilterSheet lookups={lookups} filters={filters} />
          )}
          <Link
            href="/wardrobe/new"
            className="btn-ghost hidden min-h-[var(--touch-min)] sm:inline-flex"
          >
            Add
          </Link>
          <IconLink
            href="/wardrobe/new"
            icon={actionIcons.add}
            label="Add item"
            className="sm:hidden"
          />
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
          message="Your wardrobe is empty."
          actionLabel="Add your first piece"
          actionHref="/wardrobe/new"
        />
      ) : (
        <ItemList items={items} />
      )}
    </PageShell>
  );
}
