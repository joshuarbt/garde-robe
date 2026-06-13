export const ITEM_TYPES = ["clothing", "accessory", "jewelry"] as const;

export type ItemType = (typeof ITEM_TYPES)[number];

export const IMAGE_PROCESSING_STATUSES = [
  "none",
  "pending",
  "processing",
  "completed",
  "failed",
] as const;

export type ImageProcessingStatus = (typeof IMAGE_PROCESSING_STATUSES)[number];

export type Item = {
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
  created_at: string;
  updated_at: string;
};

export type ItemImageProcessingFields = Pick<
  Item,
  | "id"
  | "user_id"
  | "image_path"
  | "processed_image_path"
  | "remove_background"
  | "image_processing_status"
>;

export type Category = {
  id: string;
  name: string;
  item_type: ItemType;
};

export type Brand = {
  id: string;
  name: string;
};

export type Color = {
  id: string;
  name: string;
  hex_code: string | null;
};

export type Season = {
  id: string;
  name: string;
};

export type ItemWithRelations = Item & {
  category: Category | null;
  brand: Brand | null;
  color: Color | null;
  seasons: Season[];
  image_url?: string | null;
};

export type SaveItemMetadataResult =
  | { success: true; itemId: string }
  | { success: false; error: string; fieldErrors?: ItemFormErrors };

export type WardrobeFilters = {
  category?: string;
  color?: string;
  season?: string;
  brand?: string;
};

export type WardrobeLookups = {
  categories: Category[];
  brands: Brand[];
  colors: Color[];
  seasons: Season[];
};

export type ItemFormInput = {
  name: string;
  item_type: ItemType;
  category_id: string;
  new_category_name: string;
  color_id: string;
  brand_id: string;
  new_brand_name: string;
  season_ids: string[];
  occasion_tags: string;
  notes: string;
};

export type ItemFormErrors = Partial<Record<keyof ItemFormInput | "_form", string>>;

export type ActionResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: ItemFormErrors };
