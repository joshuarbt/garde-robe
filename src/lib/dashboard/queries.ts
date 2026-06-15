import { DEFAULT_CURRENCY } from "@/lib/currency";
import { createClient } from "@/lib/supabase/server";

export type CategoryBreakdownEntry = {
  label: string;
  count: number;
};

export type DashboardStats = {
  itemCount: number;
  outfitCount: number;
  wardrobeValue: number;
  profileCurrency: string;
  itemsWithoutPrice: number;
  itemsWithOtherCurrency: number;
  categoryBreakdown: CategoryBreakdownEntry[];
};

type ItemStatsRow = {
  price: number | null;
  currency_code: string | null;
  category_id: string | null;
  categories: { name: string } | { name: string }[] | null;
};

const EMPTY_STATS: DashboardStats = {
  itemCount: 0,
  outfitCount: 0,
  wardrobeValue: 0,
  profileCurrency: DEFAULT_CURRENCY,
  itemsWithoutPrice: 0,
  itemsWithOtherCurrency: 0,
  categoryBreakdown: [],
};

function getCategoryLabel(row: ItemStatsRow): string {
  const categories = row.categories;
  if (Array.isArray(categories)) {
    return categories[0]?.name ?? "Sans catégorie";
  }
  return categories?.name ?? "Sans catégorie";
}

function buildCategoryBreakdown(items: ItemStatsRow[]): CategoryBreakdownEntry[] {
  const counts = new Map<string, number>();

  for (const item of items) {
    const label = getCategoryLabel(item);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return EMPTY_STATS;
  }

  const [profileResult, itemsResult, outfitsResult] = await Promise.all([
    supabase.from("profiles").select("currency_code").eq("id", user.id).maybeSingle(),
    supabase
      .from("items")
      .select("price, currency_code, category_id, categories(name)"),
    supabase.from("outfits").select("id", { count: "exact", head: true }),
  ]);

  if (profileResult.error) {
    throw new Error(profileResult.error.message);
  }
  if (itemsResult.error) {
    throw new Error(itemsResult.error.message);
  }
  if (outfitsResult.error) {
    throw new Error(outfitsResult.error.message);
  }

  const profileCurrency = profileResult.data?.currency_code ?? DEFAULT_CURRENCY;
  const items = (itemsResult.data ?? []) as ItemStatsRow[];
  let wardrobeValue = 0;
  let itemsWithoutPrice = 0;
  let itemsWithOtherCurrency = 0;

  for (const item of items) {
    if (item.price === null) {
      itemsWithoutPrice += 1;
      continue;
    }

    const itemCurrency = item.currency_code ?? profileCurrency;
    if (itemCurrency !== profileCurrency) {
      itemsWithOtherCurrency += 1;
      continue;
    }

    wardrobeValue += Number(item.price);
  }

  return {
    itemCount: items.length,
    outfitCount: outfitsResult.count ?? 0,
    wardrobeValue,
    profileCurrency,
    itemsWithoutPrice,
    itemsWithOtherCurrency,
    categoryBreakdown: buildCategoryBreakdown(items),
  };
}
