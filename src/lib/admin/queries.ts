import { resolvePreviewItems, type PreviewPlacementRow } from "@/lib/outfit/preview";
import { resolveDisplayImagePath } from "@/lib/image-processing/resolve";
import { createAdminClient } from "@/lib/supabase/admin";
import { getItemImageUrl } from "@/lib/storage/images";
import type { AdminUserDetail, AdminUserSummary } from "@/lib/admin/types";
import type { ItemWithRelations } from "@/lib/types/item";
import type { OutfitSummary } from "@/lib/types/outfit";
import type { ImageProcessingStatus } from "@/lib/types/item";

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
};

type OutfitRow = {
  id: string;
  name: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  outfit_items: PreviewPlacementRow[] | null;
};

function firstRelation<T>(value: Relation<T>): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}

function buildCountMap(rows: Array<{ user_id: string }>): Map<string, number> {
  const map = new Map<string, number>();

  for (const row of rows) {
    map.set(row.user_id, (map.get(row.user_id) ?? 0) + 1);
  }

  return map;
}

async function getStatsForUsers(
  userIds: string[],
): Promise<Map<string, { itemCount: number; outfitCount: number; tripCount: number }>> {
  if (userIds.length === 0) {
    return new Map();
  }

  const admin = createAdminClient();

  const [itemsResult, outfitsResult, tripsResult] = await Promise.all([
    admin.from("items").select("user_id").in("user_id", userIds),
    admin.from("outfits").select("user_id").in("user_id", userIds),
    admin.from("trips").select("user_id").in("user_id", userIds),
  ]);

  if (itemsResult.error) {
    throw new Error(itemsResult.error.message);
  }

  if (outfitsResult.error) {
    throw new Error(outfitsResult.error.message);
  }

  if (tripsResult.error) {
    throw new Error(tripsResult.error.message);
  }

  const itemCounts = buildCountMap(itemsResult.data ?? []);
  const outfitCounts = buildCountMap(outfitsResult.data ?? []);
  const tripCounts = buildCountMap(tripsResult.data ?? []);

  const stats = new Map<string, { itemCount: number; outfitCount: number; tripCount: number }>();

  for (const userId of userIds) {
    stats.set(userId, {
      itemCount: itemCounts.get(userId) ?? 0,
      outfitCount: outfitCounts.get(userId) ?? 0,
      tripCount: tripCounts.get(userId) ?? 0,
    });
  }

  return stats;
}

function mapAuthUserToSummary(
  user: {
    id: string;
    email?: string;
    created_at?: string;
    last_sign_in_at?: string;
  },
  stats: { itemCount: number; outfitCount: number; tripCount: number },
): AdminUserSummary {
  return {
    id: user.id,
    email: user.email ?? "—",
    createdAt: user.created_at ?? "",
    lastSignInAt: user.last_sign_in_at ?? null,
    itemCount: stats.itemCount,
    outfitCount: stats.outfitCount,
    tripCount: stats.tripCount,
  };
}

export async function listUsersWithStats(
  page = 1,
  perPage = 50,
): Promise<{ users: AdminUserSummary[]; total: number }> {
  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.listUsers({ page, perPage });

  if (error) {
    throw new Error(error.message);
  }

  const authUsers = data.users ?? [];
  const userIds = authUsers.map((user) => user.id);
  const statsByUser = await getStatsForUsers(userIds);

  const users = authUsers.map((user) =>
    mapAuthUserToSummary(user, statsByUser.get(user.id) ?? {
      itemCount: 0,
      outfitCount: 0,
      tripCount: 0,
    }),
  );

  return {
    users,
    total: data.total ?? users.length,
  };
}

export async function getUserDetail(userId: string): Promise<AdminUserDetail | null> {
  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.getUserById(userId);

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    return null;
  }

  const statsByUser = await getStatsForUsers([userId]);
  const stats = statsByUser.get(userId) ?? {
    itemCount: 0,
    outfitCount: 0,
    tripCount: 0,
  };

  return mapAuthUserToSummary(data.user, stats);
}

function mapItemRow(row: ItemRowRaw): ItemWithRelations {
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
    seasons: [],
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
  colors ( id, name, hex_code )
`;

export async function getUserItems(userId: string): Promise<ItemWithRelations[]> {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("items")
    .select(itemSelect)
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return Promise.all(
    (data as ItemRowRaw[]).map(async (row) => {
      const item = mapItemRow(row);
      const displayPath = resolveDisplayImagePath(item);
      const image_url = await getItemImageUrl(displayPath);

      return {
        ...item,
        image_url,
      };
    }),
  );
}

export async function getUserOutfits(userId: string): Promise<OutfitSummary[]> {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("outfits")
    .select(`
      id,
      name,
      notes,
      created_at,
      updated_at,
      outfit_items (
        item_id,
        position_x,
        position_y,
        scale,
        rotation,
        z_index,
        items (
          image_path,
          processed_image_path,
          remove_background,
          image_processing_status
        )
      )
    `)
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return Promise.all(
    (data as OutfitRow[]).map(async (row) => {
      const placementRows = row.outfit_items ?? [];

      return {
        id: row.id,
        name: row.name,
        notes: row.notes,
        previewItems: await resolvePreviewItems(placementRows),
        itemCount: placementRows.length,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    }),
  );
}
