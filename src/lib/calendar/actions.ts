"use server";

import { revalidatePath } from "next/cache";
import type { AssignOutfitResult, CalendarActionResult } from "@/lib/types/calendar";
import { createClient } from "@/lib/supabase/server";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

async function requireUserId(): Promise<string | { success: false; error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in." };
  }

  return user.id;
}

function parseScheduledDate(value: string): string | null {
  if (!DATE_REGEX.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return value;
}

export async function assignOutfitToDate(
  scheduledDate: string,
  outfitId: string,
): Promise<AssignOutfitResult> {
  const userResult = await requireUserId();
  if (typeof userResult !== "string") {
    return userResult;
  }

  const parsedDate = parseScheduledDate(scheduledDate);
  if (!parsedDate) {
    return { success: false, error: "Invalid date." };
  }

  const supabase = await createClient();

  const { data: outfit, error: outfitError } = await supabase
    .from("outfits")
    .select("id")
    .eq("id", outfitId)
    .maybeSingle();

  if (outfitError || !outfit) {
    return { success: false, error: "Outfit not found." };
  }

  const { error } = await supabase.from("outfit_calendar_entries").upsert(
    {
      user_id: userResult,
      outfit_id: outfitId,
      scheduled_date: parsedDate,
    },
    { onConflict: "user_id,scheduled_date" },
  );

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/calendar");
  return { success: true };
}

export async function removeCalendarEntry(scheduledDate: string): Promise<CalendarActionResult> {
  const userResult = await requireUserId();
  if (typeof userResult !== "string") {
    return userResult;
  }

  const parsedDate = parseScheduledDate(scheduledDate);
  if (!parsedDate) {
    return { success: false, error: "Invalid date." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("outfit_calendar_entries")
    .delete()
    .eq("scheduled_date", parsedDate);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/calendar");
  return { success: true };
}
