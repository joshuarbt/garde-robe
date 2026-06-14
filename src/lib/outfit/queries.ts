import { resolvePreviewItems, type PreviewPlacementRow } from "@/lib/outfit/preview";
import type {
  CanvasItemPlacement,
  OutfitSummary,
  OutfitWithPlacements,
} from "@/lib/types/outfit";
import { createClient } from "@/lib/supabase/server";

type OutfitRow = {
  id: string;
  name: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  outfit_items: PreviewPlacementRow[] | null;
};

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
