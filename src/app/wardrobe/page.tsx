import Link from "next/link";
import { redirect } from "next/navigation";
import { ItemList } from "@/components/wardrobe/ItemList";
import { WardrobeFiltersBar } from "@/components/wardrobe/WardrobeFilters";
import { PageShell } from "@/components/layout/PageShell";
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

  return (
    <PageShell
      title="Wardrobe"
      description="Browse and manage your clothing, accessories, and jewelry."
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-stone-600">
          {items.length} item{items.length === 1 ? "" : "s"}
        </p>
        <Link
          href="/wardrobe/new"
          className="inline-flex items-center justify-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
        >
          Add item
        </Link>
      </div>

      <div className="space-y-6">
        <WardrobeFiltersBar lookups={lookups} filters={filters} />

        {items.length === 0 && !params.category && !params.color && !params.season && !params.brand ? (
          <div className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center">
            <p className="text-stone-600">No items yet.</p>
            <Link
              href="/wardrobe/new"
              className="mt-3 inline-block text-sm font-medium text-stone-900 hover:underline"
            >
              Add your first item
            </Link>
          </div>
        ) : (
          <ItemList items={items} />
        )}
      </div>
    </PageShell>
  );
}
