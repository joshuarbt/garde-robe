import type {
  ImageProcessingStatus,
  ItemWithRelations,
  WardrobeFilters,
  WardrobeLookups,
} from "@/lib/types/item";
import { DEFAULT_CURRENCY } from "@/lib/currency";
import { resolveDisplayImagePath } from "@/lib/image-processing/resolve";
import { getItemImageUrl } from "@/lib/storage/images";
import { createClient } from "@/lib/supabase/server";

type Relation<T> = T | T[] | null;

type ItemRowRaw = {
  id: string;
  user_id: string;
  name: string;
  item_type: "clothing" | "accessory" | "jewelry";
  category_id: string | null;
  color_id: string | null;
  brand_id: string | null;
  occasion_tags: string[];
  image_path: string | null;
  processed_image_path: string | null;
  remove_background: boolean;
  image_processing_status: ImageProcessingStatus;
  image_processing_error: string | null;
  image_processing_attempts: number;
  image_processing_updated_at: string | null;
  notes: string | null;
  price: number | null;
  currency_code: string | null;
  created_at: string;
  updated_at: string;
  categories: Relation<{ id: string; name: string; item_type: string }>;
  brands: Relation<{ id: string; name: string }>;
  colors: Relation<{ id: string; name: string; hex_code: string | null }>;
  item_seasons: { seasons: Relation<{ id: string; name: string }> }[];
};

function firstRelation<T>(value: Relation<T>): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}

function mapItem(row: ItemRowRaw): ItemWithRelations {
  const category = firstRelation(row.categories);
  const brand = firstRelation(row.brands);
  const color = firstRelation(row.colors);

  return {
    id: row.id,
    user_id: row.user_id,
    name: row.name,
    item_type: row.item_type,
    category_id: row.category_id,
    color_id: row.color_id,
    brand_id: row.brand_id,
    occasion_tags: row.occasion_tags ?? [],
    image_path: row.image_path,
    processed_image_path: row.processed_image_path,
    remove_background: row.remove_background ?? false,
    image_processing_status: row.image_processing_status ?? "none",
    image_processing_error: row.image_processing_error,
    image_processing_attempts: row.image_processing_attempts ?? 0,
    image_processing_updated_at: row.image_processing_updated_at,
    notes: row.notes,
    price: row.price !== null ? Number(row.price) : null,
    currency_code: row.currency_code,
    created_at: row.created_at,
    updated_at: row.updated_at,
    category: category
      ? {
          id: category.id,
          name: category.name,
          item_type: category.item_type as ItemWithRelations["item_type"],
        }
      : null,
    brand,
    color,
    seasons: (row.item_seasons ?? [])
      .map((entry) => firstRelation(entry.seasons))
      .filter((season): season is { id: string; name: string } => season !== null),
  };
}

async function enrichItem(row: ItemRowRaw): Promise<ItemWithRelations> {
  const item = mapItem(row);
  const displayPath = resolveDisplayImagePath(item);
  const image_url = await getItemImageUrl(displayPath);

  return {
    ...item,
    image_url,
  };
}

const itemSelect = `
  id,
  user_id,
  name,
  item_type,
  category_id,
  color_id,
  brand_id,
  occasion_tags,
  image_path,
  processed_image_path,
  remove_background,
  image_processing_status,
  image_processing_error,
  image_processing_attempts,
  image_processing_updated_at,
  notes,
  price,
  currency_code,
  created_at,
  updated_at,
  categories ( id, name, item_type ),
  brands ( id, name ),
  colors ( id, name, hex_code ),
  item_seasons ( seasons ( id, name ) )
`;

export async function getWardrobeLookups(): Promise<WardrobeLookups> {
  const supabase = await createClient();

  const [categoriesResult, brandsResult, colorsResult, seasonsResult] =
    await Promise.all([
      supabase
        .from("categories")
        .select("id, name, item_type")
        .order("name", { ascending: true }),
      supabase.from("brands").select("id, name").order("name", { ascending: true }),
      supabase.from("colors").select("id, name, hex_code").order("sort_order", {
        ascending: true,
      }),
      supabase.from("seasons").select("id, name").order("sort_order", {
        ascending: true,
      }),
    ]);

  if (categoriesResult.error) {
    throw new Error(categoriesResult.error.message);
  }
  if (brandsResult.error) {
    throw new Error(brandsResult.error.message);
  }
  if (colorsResult.error) {
    throw new Error(colorsResult.error.message);
  }
  if (seasonsResult.error) {
    throw new Error(seasonsResult.error.message);
  }

  return {
    categories: categoriesResult.data ?? [],
    brands: brandsResult.data ?? [],
    colors: colorsResult.data ?? [],
    seasons: seasonsResult.data ?? [],
  };
}

export async function getItems(
  filters: WardrobeFilters = {},
): Promise<ItemWithRelations[]> {
  const supabase = await createClient();

  if (filters.season) {
    const { data: seasonLinks, error: seasonError } = await supabase
      .from("item_seasons")
      .select("item_id")
      .eq("season_id", filters.season);

    if (seasonError) {
      throw new Error(seasonError.message);
    }

    const itemIds = (seasonLinks ?? []).map((row) => row.item_id);
    if (itemIds.length === 0) {
      return [];
    }

    let query = supabase.from("items").select(itemSelect).in("id", itemIds);

    if (filters.category) {
      query = query.eq("category_id", filters.category);
    }
    if (filters.color) {
      query = query.eq("color_id", filters.color);
    }
    if (filters.brand) {
      query = query.eq("brand_id", filters.brand);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return Promise.all((data as ItemRowRaw[]).map(enrichItem));
  }

  let query = supabase.from("items").select(itemSelect);

  if (filters.category) {
    query = query.eq("category_id", filters.category);
  }
  if (filters.color) {
    query = query.eq("color_id", filters.color);
  }
  if (filters.brand) {
    query = query.eq("brand_id", filters.brand);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return Promise.all((data as ItemRowRaw[]).map(enrichItem));
}

export async function getItemById(id: string): Promise<ItemWithRelations | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("items")
    .select(itemSelect)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return enrichItem(data as ItemRowRaw);
}

export async function getProfileCurrency(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return DEFAULT_CURRENCY;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("currency_code")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data?.currency_code) {
    return DEFAULT_CURRENCY;
  }

  return data.currency_code;
}
