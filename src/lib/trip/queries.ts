import { resolvePreviewItems, type PreviewPlacementRow } from "@/lib/outfit/preview";
import { resolveDisplayImagePath } from "@/lib/image-processing/resolve";
import { getItemImageUrl } from "@/lib/storage/images";
import type { OutfitSummary } from "@/lib/types/outfit";
import type { ImageProcessingStatus } from "@/lib/types/item";
import type {
  Trip,
  TripPackingItem,
  TripSummary,
  TripWithOutfits,
} from "@/lib/types/trip";
import { createClient } from "@/lib/supabase/server";

type TripRow = {
  id: string;
  user_id: string;
  name: string;
  destination: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
};

type OutfitRowForTrip = {
  id: string;
  name: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  outfit_items: PreviewPlacementRow[] | null;
};

type Relation<T> = T | T[] | null;

function firstRelation<T>(value: Relation<T>): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}

type TripItemRow = {
  item_id: string;
  is_packed: boolean;
  items: Relation<{
    name: string;
    image_path: string | null;
    processed_image_path: string | null;
    remove_background: boolean;
    image_processing_status: ImageProcessingStatus;
  }>;
};

function mapTrip(row: TripRow): Trip {
  return {
    id: row.id,
    user_id: row.user_id,
    name: row.name,
    destination: row.destination,
    start_date: row.start_date,
    end_date: row.end_date,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

async function mapOutfitRow(row: OutfitRowForTrip): Promise<OutfitSummary> {
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
}

export async function getTrips(): Promise<TripSummary[]> {
  const supabase = await createClient();

  const { data: trips, error } = await supabase
    .from("trips")
    .select("id, user_id, name, destination, start_date, end_date, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  if (!trips?.length) {
    return [];
  }

  const tripIds = trips.map((trip) => trip.id);

  const [{ data: outfitLinks }, { data: itemRows }] = await Promise.all([
    supabase.from("trip_outfits").select("trip_id").in("trip_id", tripIds),
    supabase.from("trip_items").select("trip_id, is_packed").in("trip_id", tripIds),
  ]);

  const outfitCountByTrip = new Map<string, number>();
  for (const link of outfitLinks ?? []) {
    outfitCountByTrip.set(link.trip_id, (outfitCountByTrip.get(link.trip_id) ?? 0) + 1);
  }

  const itemStatsByTrip = new Map<string, { total: number; packed: number }>();
  for (const row of itemRows ?? []) {
    const current = itemStatsByTrip.get(row.trip_id) ?? { total: 0, packed: 0 };
    current.total += 1;
    if (row.is_packed) {
      current.packed += 1;
    }
    itemStatsByTrip.set(row.trip_id, current);
  }

  return (trips as TripRow[]).map((row) => {
    const stats = itemStatsByTrip.get(row.id) ?? { total: 0, packed: 0 };

    return {
      ...mapTrip(row),
      outfitCount: outfitCountByTrip.get(row.id) ?? 0,
      itemCount: stats.total,
      packedCount: stats.packed,
    };
  });
}

export async function getTripById(id: string): Promise<TripWithOutfits | null> {
  const supabase = await createClient();

  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .select("id, user_id, name, destination, start_date, end_date, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (tripError) {
    throw new Error(tripError.message);
  }

  if (!trip) {
    return null;
  }

  const { data: links, error: linksError } = await supabase
    .from("trip_outfits")
    .select(`
      outfit_id,
      outfits (
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
      )
    `)
    .eq("trip_id", id);

  if (linksError) {
    throw new Error(linksError.message);
  }

  const outfits = await Promise.all(
    (links ?? [])
      .map((link) => firstRelation(link.outfits as Relation<OutfitRowForTrip>))
      .filter((outfit): outfit is OutfitRowForTrip => outfit != null)
      .map(mapOutfitRow),
  );

  return {
    ...mapTrip(trip as TripRow),
    outfits,
  };
}

export async function getTripPackingList(tripId: string): Promise<TripPackingItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("trip_items")
    .select(`
      item_id,
      is_packed,
      items (
        name,
        image_path,
        processed_image_path,
        remove_background,
        image_processing_status
      )
    `)
    .eq("trip_id", tripId)
    .order("item_id");

  if (error) {
    throw new Error(error.message);
  }

  return Promise.all(
    (data ?? []).map(async (row) => {
      const typed = row as TripItemRow;
      const item = firstRelation(typed.items);
      const displayPath = item
        ? resolveDisplayImagePath({
            id: typed.item_id,
            user_id: "",
            image_path: item.image_path,
            processed_image_path: item.processed_image_path,
            remove_background: item.remove_background ?? false,
            image_processing_status: item.image_processing_status ?? "none",
          })
        : null;

      return {
        itemId: typed.item_id,
        name: item?.name ?? "Vêtement",
        imageUrl: await getItemImageUrl(displayPath),
        isPacked: typed.is_packed,
      };
    }),
  );
}

export async function getOutfitItemIds(outfitId: string): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("outfit_items")
    .select("item_id")
    .eq("outfit_id", outfitId);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => row.item_id);
}
