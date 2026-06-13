"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { toCanvasItemPlacements } from "@/lib/canvas/placements";
import type { CanvasPlacementState } from "@/lib/types/outfit";
import type { OutfitActionResult, SaveOutfitResult } from "@/lib/outfit/validation";
import { validateOutfitInput } from "@/lib/outfit/validation";
import { createClient } from "@/lib/supabase/server";

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

function mapPlacementsToRows(
  outfitId: string,
  placements: CanvasPlacementState[],
) {
  return toCanvasItemPlacements(placements).map((placement) => ({
    outfit_id: outfitId,
    item_id: placement.itemId,
    position_x: placement.x,
    position_y: placement.y,
    scale: placement.scale,
    rotation: placement.rotation,
    z_index: placement.zIndex,
  }));
}

export async function saveOutfit(input: {
  name: string;
  notes?: string;
  placements: CanvasPlacementState[];
  outfitId?: string;
}): Promise<SaveOutfitResult> {
  const userResult = await requireUserId();
  if (typeof userResult !== "string") {
    return userResult;
  }

  const validation = validateOutfitInput({
    name: input.name,
    notes: input.notes ?? "",
    placements: input.placements,
  });

  if (!("data" in validation)) {
    return {
      success: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: validation.errors,
    };
  }

  const { name, notes, placements } = validation.data;
  const supabase = await createClient();
  let savedOutfitId = input.outfitId;

  const outfitPayload = {
    name,
    notes: notes || null,
  };

  if (input.outfitId) {
    const { data: existing, error: fetchError } = await supabase
      .from("outfits")
      .select("id")
      .eq("id", input.outfitId)
      .maybeSingle();

    if (fetchError || !existing) {
      return { success: false, error: "Outfit not found." };
    }

    const { error: updateError } = await supabase
      .from("outfits")
      .update(outfitPayload)
      .eq("id", input.outfitId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }
  } else {
    const { data: created, error: insertError } = await supabase
      .from("outfits")
      .insert({ user_id: userResult, ...outfitPayload })
      .select("id")
      .single();

    if (insertError || !created) {
      return { success: false, error: insertError?.message ?? "Could not create outfit." };
    }

    savedOutfitId = created.id;
  }

  if (!savedOutfitId) {
    return { success: false, error: "Could not save outfit." };
  }

  const { error: deleteError } = await supabase
    .from("outfit_items")
    .delete()
    .eq("outfit_id", savedOutfitId);

  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  const rows = mapPlacementsToRows(savedOutfitId, placements);
  if (rows.length > 0) {
    const { error: insertItemsError } = await supabase.from("outfit_items").insert(rows);

    if (insertItemsError) {
      return { success: false, error: insertItemsError.message };
    }
  }

  revalidatePath("/outfits");
  revalidatePath(`/outfits/${savedOutfitId}`);
  revalidatePath("/calendar");
  revalidatePath("/dashboard");

  return { success: true, outfitId: savedOutfitId };
}

export async function deleteOutfit(outfitId: string): Promise<OutfitActionResult> {
  const userResult = await requireUserId();
  if (typeof userResult !== "string") {
    return userResult;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("outfits").delete().eq("id", outfitId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/outfits");
  revalidatePath("/calendar");
  revalidatePath("/dashboard");
  redirect("/outfits");
}
