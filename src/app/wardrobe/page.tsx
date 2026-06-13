import Link from "next/link";
import { redirect } from "next/navigation";
import { ItemList } from "@/components/wardrobe/ItemList";
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

  return (
    <PageShell
      title="Wardrobe"
      description="Browse and manage your clothing, accessories, and jewelry."
      wide
      actions={
        <Link href="/wardrobe/new" className="btn-primary">
          Add item
        </Link>
      }
    >
      <p className="label-caps mb-8">
        {items.length} item{items.length === 1 ? "" : "s"}
      </p>

      <div className="space-y-8">
        {items.length > 0 || hasActiveFilters ? (
          <WardrobeFiltersBar lookups={lookups} filters={filters} />
        ) : null}

        {items.length === 0 && !hasActiveFilters ? (
          <EmptyState
            message="No items yet."
            actionLabel="Add your first item"
            actionHref="/wardrobe/new"
          />
        ) : (
          <ItemList items={items} />
        )}
      </div>
    </PageShell>
  );
}
