import type {
  CanvasItemPlacement,
  OutfitSummary,
  OutfitWithPlacements,
} from "@/lib/types/outfit";
import type { ImageProcessingStatus, ItemImageProcessingFields } from "@/lib/types/item";
import { resolveDisplayImagePath } from "@/lib/image-processing/resolve";
import { getItemImageUrl } from "@/lib/storage/images";
import { createClient } from "@/lib/supabase/server";

type Relation<T> = T | T[] | null;

type PreviewItemRow = {
  z_index: number;
  items: Relation<{
    image_path: string | null;
    processed_image_path: string | null;
    remove_background: boolean;
    image_processing_status: ImageProcessingStatus;
  }>;
};

type OutfitRow = {
  id: string;
  name: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  outfit_items: PreviewItemRow[] | null;
};

function firstRelation<T>(value: Relation<T>): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}

async function resolvePreviewImageUrl(
  placementRows: PreviewItemRow[],
): Promise<string | null> {
  const sorted = [...placementRows].sort((a, b) => a.z_index - b.z_index);

  for (const entry of sorted) {
    const item = firstRelation(entry.items);
    if (!item?.image_path && !item?.processed_image_path) {
      continue;
    }

    const displayPath = resolveDisplayImagePath({
      id: "",
      user_id: "",
      image_path: item.image_path,
      processed_image_path: item.processed_image_path,
      remove_background: item.remove_background ?? false,
      image_processing_status: item.image_processing_status ?? "none",
    } satisfies ItemImageProcessingFields);

    if (!displayPath) {
      continue;
    }

    return getItemImageUrl(displayPath);
  }

  return null;
}

export async function getOutfits(): Promise<OutfitSummary[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("outfits")
    .select(`
      id,
      name,
      notes,
      created_at,
      updated_at,
      outfit_items (
        z_index,
        items (
          image_path,
          processed_image_path,
          remove_background,
          image_processing_status
        )
      )
    `)
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
        previewImageUrl: await resolvePreviewImageUrl(placementRows),
        itemCount: placementRows.length,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    }),
  );
}

export async function getOutfitById(id: string): Promise<OutfitWithPlacements | null> {
  const supabase = await createClient();

  const { data: outfit, error: outfitError } = await supabase
    .from("outfits")
    .select("id, name, notes, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (outfitError) {
    throw new Error(outfitError.message);
  }

  if (!outfit) {
    return null;
  }

  const { data: items, error: itemsError } = await supabase
    .from("outfit_items")
    .select("item_id, position_x, position_y, scale, rotation, z_index")
    .eq("outfit_id", id)
    .order("z_index", { ascending: true });

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  const placements: CanvasItemPlacement[] = (items ?? []).map((row) => ({
    itemId: row.item_id,
    x: row.position_x,
    y: row.position_y,
    scale: row.scale,
    rotation: row.rotation,
    zIndex: row.z_index,
  }));

  return {
    id: outfit.id,
    name: outfit.name,
    notes: outfit.notes,
    placements,
    createdAt: outfit.created_at,
    updatedAt: outfit.updated_at,
  };
}
