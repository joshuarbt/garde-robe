import type { OutfitSummary } from "@/lib/types/outfit";

export type Trip = {
  id: string;
  user_id: string;
  name: string;
  destination: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
};

export type TripSummary = Trip & {
  outfitCount: number;
  itemCount: number;
  packedCount: number;
};

export type TripWithOutfits = Trip & {
  outfits: OutfitSummary[];
};

export type TripPackingItem = {
  itemId: string;
  name: string;
  imageUrl: string | null;
  isPacked: boolean;
};

export type TripActionResult = {
  success: boolean;
  error?: string;
};

export type CreateTripResult =
  | { success: true; tripId: string }
  | { success: false; error: string; fieldErrors?: TripFormErrors };

export type TripFormInput = {
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
};

export type TripFormErrors = Partial<Record<keyof TripFormInput, string>>;
