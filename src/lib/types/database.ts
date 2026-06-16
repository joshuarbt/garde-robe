import type { ImageProcessingStatus, ItemType } from "@/lib/types/item";

/**
 * Hand-maintained row types mirroring public.* tables.
 * Regenerate from Supabase CLI when adopting generated types:
 *   supabase gen types typescript --local > src/lib/types/database.generated.ts
 */

export type ProfilesRow = {
  id: string;
  currency_code: string;
  weather_latitude: number | null;
  weather_longitude: number | null;
  weather_location_label: string | null;
  created_at: string;
  updated_at: string;
};

export type ItemsRow = {
  id: string;
  user_id: string;
  name: string;
  item_type: ItemType;
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
};

export type OutfitsRow = {
  id: string;
  user_id: string;
  name: string;
  notes: string | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type OutfitItemsRow = {
  id: string;
  outfit_id: string;
  item_id: string;
  position_x: number;
  position_y: number;
  scale: number;
  rotation: number;
  z_index: number;
};

export type OutfitCalendarEntriesRow = {
  id: string;
  user_id: string;
  outfit_id: string;
  scheduled_date: string;
  occasion: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type TripsRow = {
  id: string;
  user_id: string;
  name: string;
  destination: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
};

export type TripOutfitsRow = {
  id: string;
  trip_id: string;
  outfit_id: string;
};

export type TripItemsRow = {
  id: string;
  trip_id: string;
  item_id: string;
  is_packed: boolean;
};
