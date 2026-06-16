"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getOutfitItemIds } from "@/lib/trip/queries";
import {
  normalizeTripDates,
  parseTripFormData,
  validateTripFormInput,
} from "@/lib/trip/validation";
import type { CreateTripResult, TripActionResult } from "@/lib/types/trip";
import { createClient } from "@/lib/supabase/server";

async function requireUserId(): Promise<string | { success: false; error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Vous devez être connecté." };
  }

  return user.id;
}

async function verifyTripOwnership(
  tripId: string,
  userId: string,
): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .select("id")
    .eq("id", tripId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    return false;
  }

  return true;
}

function revalidateTripPaths(tripId: string) {
  revalidatePath("/voyages");
  revalidatePath(`/voyages/${tripId}`);
}

export async function createTrip(formData: FormData): Promise<CreateTripResult> {
  const userResult = await requireUserId();
  if (typeof userResult !== "string") {
    return userResult;
  }

  const input = parseTripFormData(formData);
  const fieldErrors = validateTripFormInput(input);

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, error: "Corrigez les champs indiqués.", fieldErrors };
  }

  const { start_date, end_date } = normalizeTripDates(input);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("trips")
    .insert({
      user_id: userResult,
      name: input.name,
      destination: input.destination || null,
      start_date,
      end_date,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { success: false, error: error?.message ?? "Impossible de créer le voyage." };
  }

  revalidatePath("/voyages");
  redirect(`/voyages/${data.id}`);
}

export async function deleteTrip(tripId: string): Promise<TripActionResult> {
  const userResult = await requireUserId();
  if (typeof userResult !== "string") {
    return userResult;
  }

  if (!(await verifyTripOwnership(tripId, userResult))) {
    return { success: false, error: "Voyage introuvable." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("trips").delete().eq("id", tripId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/voyages");
  redirect("/voyages");
}

export async function addOutfitToTrip(
  tripId: string,
  outfitId: string,
): Promise<TripActionResult> {
  const userResult = await requireUserId();
  if (typeof userResult !== "string") {
    return userResult;
  }

  if (!(await verifyTripOwnership(tripId, userResult))) {
    return { success: false, error: "Voyage introuvable." };
  }

  const supabase = await createClient();

  const { error: linkError } = await supabase.from("trip_outfits").insert({
    trip_id: tripId,
    outfit_id: outfitId,
  });

  if (linkError) {
    if (linkError.code === "23505") {
      return { success: false, error: "Cette tenue est déjà dans la valise." };
    }
    return { success: false, error: linkError.message };
  }

  const itemIds = await getOutfitItemIds(outfitId);

  if (itemIds.length > 0) {
    const { error: itemsError } = await supabase.from("trip_items").upsert(
      itemIds.map((itemId) => ({
        trip_id: tripId,
        item_id: itemId,
        is_packed: false,
      })),
      { onConflict: "trip_id,item_id", ignoreDuplicates: true },
    );

    if (itemsError) {
      return { success: false, error: itemsError.message };
    }
  }

  revalidateTripPaths(tripId);
  return { success: true };
}

export async function addItemToTrip(
  tripId: string,
  itemId: string,
): Promise<TripActionResult> {
  const userResult = await requireUserId();
  if (typeof userResult !== "string") {
    return userResult;
  }

  if (!(await verifyTripOwnership(tripId, userResult))) {
    return { success: false, error: "Voyage introuvable." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("trip_items").upsert(
    {
      trip_id: tripId,
      item_id: itemId,
      is_packed: false,
    },
    { onConflict: "trip_id,item_id", ignoreDuplicates: true },
  );

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateTripPaths(tripId);
  return { success: true };
}

export async function toggleItemPacked(
  tripId: string,
  itemId: string,
  isPacked: boolean,
): Promise<TripActionResult> {
  const userResult = await requireUserId();
  if (typeof userResult !== "string") {
    return userResult;
  }

  if (!(await verifyTripOwnership(tripId, userResult))) {
    return { success: false, error: "Voyage introuvable." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("trip_items")
    .update({ is_packed: isPacked })
    .eq("trip_id", tripId)
    .eq("item_id", itemId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateTripPaths(tripId);
  return { success: true };
}

export async function resetTripPacking(tripId: string): Promise<TripActionResult> {
  const userResult = await requireUserId();
  if (typeof userResult !== "string") {
    return userResult;
  }

  if (!(await verifyTripOwnership(tripId, userResult))) {
    return { success: false, error: "Voyage introuvable." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("trip_items")
    .update({ is_packed: false })
    .eq("trip_id", tripId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateTripPaths(tripId);
  return { success: true };
}
