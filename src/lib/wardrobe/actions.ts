"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type {
  ActionResult,
  ItemFormErrors,
  ItemFormInput,
  ItemType,
  SaveItemMetadataResult,
} from "@/lib/types/item";
import {
  buildItemFolderPrefix,
  buildItemProcessedPath,
  ITEM_IMAGES_BUCKET,
} from "@/lib/storage/paths";
import { resetImageProcessingState } from "@/lib/image-processing/service";
import { createClient } from "@/lib/supabase/server";
import {
  parseItemFormData,
  parseOccasionTags,
  validateItemFormInput,
} from "@/lib/wardrobe/validation";

type ActionError = {
  success: false;
  error: string;
  fieldErrors?: ItemFormErrors;
};

async function requireUserId(): Promise<
  string | { success: false; error: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in." };
  }

  return user.id;
}

async function resolveCategoryId(
  userId: string,
  input: ItemFormInput,
): Promise<string | ActionError> {
  const supabase = await createClient();

  if (input.category_id) {
    return input.category_id;
  }

  const { data, error } = await supabase
    .from("categories")
    .insert({
      user_id: userId,
      name: input.new_category_name,
      item_type: input.item_type,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      const { data: existing, error: existingError } = await supabase
        .from("categories")
        .select("id")
        .eq("user_id", userId)
        .eq("name", input.new_category_name)
        .eq("item_type", input.item_type)
        .single();

      if (existingError || !existing) {
        return { success: false, error: "Could not create category." };
      }

      return existing.id;
    }

    return { success: false, error: error.message };
  }

  return data.id;
}

async function resolveBrandId(
  userId: string,
  input: ItemFormInput,
): Promise<string | null | ActionError> {
  if (!input.brand_id && !input.new_brand_name) {
    return null;
  }

  const supabase = await createClient();

  if (input.brand_id) {
    return input.brand_id;
  }

  const { data, error } = await supabase
    .from("brands")
    .insert({
      user_id: userId,
      name: input.new_brand_name,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      const { data: existing, error: existingError } = await supabase
        .from("brands")
        .select("id")
        .eq("user_id", userId)
        .eq("name", input.new_brand_name)
        .single();

      if (existingError || !existing) {
        return { success: false, error: "Could not create brand." };
      }

      return existing.id;
    }

    return { success: false, error: error.message };
  }

  return data.id;
}

async function syncItemSeasons(itemId: string, seasonIds: string[]): Promise<ActionResult> {
  const supabase = await createClient();

  const { error: deleteError } = await supabase
    .from("item_seasons")
    .delete()
    .eq("item_id", itemId);

  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  if (seasonIds.length === 0) {
    return { success: true };
  }

  const { error: insertError } = await supabase.from("item_seasons").insert(
    seasonIds.map((seasonId) => ({
      item_id: itemId,
      season_id: seasonId,
    })),
  );

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  return { success: true };
}

async function deleteProcessedImageFile(
  userId: string,
  itemId: string,
): Promise<void> {
  await deleteStoragePath(buildItemProcessedPath(userId, itemId));
}

async function deleteStoragePath(path: string): Promise<void> {
  const supabase = await createClient();
  await supabase.storage.from(ITEM_IMAGES_BUCKET).remove([path]);
}

async function deleteItemStorageFolder(
  userId: string,
  itemId: string,
): Promise<void> {
  const supabase = await createClient();
  const prefix = buildItemFolderPrefix(userId, itemId);
  const { data: files } = await supabase.storage
    .from(ITEM_IMAGES_BUCKET)
    .list(prefix);

  if (!files?.length) {
    return;
  }

  const paths = files.map((file) => `${prefix}/${file.name}`);
  await supabase.storage.from(ITEM_IMAGES_BUCKET).remove(paths);
}

async function saveItemMetadataInternal(
  input: ItemFormInput,
  itemId?: string,
): Promise<SaveItemMetadataResult> {
  const userResult = await requireUserId();
  if (typeof userResult !== "string") {
    return userResult;
  }

  const validation = validateItemFormInput(input);
  if (!("data" in validation)) {
    return {
      success: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: validation.errors,
    };
  }

  const data = validation.data;
  const categoryResult = await resolveCategoryId(userResult, data);
  if (typeof categoryResult !== "string") {
    return categoryResult;
  }

  const brandResult = await resolveBrandId(userResult, data);
  if (brandResult !== null && typeof brandResult !== "string") {
    return brandResult;
  }

  const supabase = await createClient();

  const priceValue = data.price ? Number(data.price) : null;
  const currencyCode = data.price ? data.currency_code.toUpperCase() : null;

  const payload = {
    user_id: userResult,
    name: data.name,
    item_type: data.item_type as ItemType,
    category_id: categoryResult,
    color_id: data.color_id || null,
    brand_id: brandResult,
    occasion_tags: parseOccasionTags(data.occasion_tags),
    notes: data.notes || null,
    price: priceValue,
    currency_code: currencyCode,
  };

  let savedItemId = itemId;

  if (itemId) {
    const { error } = await supabase
      .from("items")
      .update(payload)
      .eq("id", itemId);

    if (error) {
      return { success: false, error: error.message };
    }

    const seasonResult = await syncItemSeasons(itemId, data.season_ids);
    if (!seasonResult.success) {
      return {
        success: false,
        error: seasonResult.error,
        fieldErrors: seasonResult.fieldErrors,
      };
    }
  } else {
    const { data: created, error } = await supabase
      .from("items")
      .insert(payload)
      .select("id")
      .single();

    if (error || !created) {
      return { success: false, error: error?.message ?? "Could not create item." };
    }

    savedItemId = created.id;

    const seasonResult = await syncItemSeasons(created.id, data.season_ids);
    if (!seasonResult.success) {
      return {
        success: false,
        error: seasonResult.error,
        fieldErrors: seasonResult.fieldErrors,
      };
    }
  }

  if (!savedItemId) {
    return { success: false, error: "Could not save item." };
  }

  revalidatePath("/wardrobe");
  return { success: true, itemId: savedItemId };
}

export async function saveItemMetadata(
  formData: FormData,
  itemId?: string,
): Promise<SaveItemMetadataResult> {
  return saveItemMetadataInternal(parseItemFormData(formData), itemId);
}

export async function updateItemImagePath(
  itemId: string,
  path: string,
): Promise<ActionResult> {
  const userResult = await requireUserId();
  if (typeof userResult !== "string") {
    return userResult;
  }

  const supabase = await createClient();
  const { data: item, error: fetchError } = await supabase
    .from("items")
    .select("user_id, image_path, remove_background")
    .eq("id", itemId)
    .single();

  if (fetchError || !item) {
    return { success: false, error: fetchError?.message ?? "Item not found." };
  }

  const processingReset = resetImageProcessingState(item.remove_background);

  const { error } = await supabase
    .from("items")
    .update({
      image_path: path,
      ...processingReset,
    })
    .eq("id", itemId);

  if (error) {
    return { success: false, error: error.message };
  }

  if (item.image_path && item.image_path !== path) {
    await deleteStoragePath(item.image_path);
  }

  await deleteProcessedImageFile(item.user_id, itemId);

  revalidatePath("/wardrobe");
  revalidatePath(`/wardrobe/${itemId}/edit`);
  return { success: true };
}

export async function removeItemImage(itemId: string): Promise<ActionResult> {
  const userResult = await requireUserId();
  if (typeof userResult !== "string") {
    return userResult;
  }

  const supabase = await createClient();
  const { data: item, error: fetchError } = await supabase
    .from("items")
    .select("user_id, image_path")
    .eq("id", itemId)
    .single();

  if (fetchError || !item) {
    return { success: false, error: fetchError?.message ?? "Item not found." };
  }

  if (item.image_path) {
    await deleteStoragePath(item.image_path);
  }

  await deleteProcessedImageFile(item.user_id, itemId);

  const { error } = await supabase
    .from("items")
    .update({
      image_path: null,
      ...resetImageProcessingState(false),
    })
    .eq("id", itemId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/wardrobe");
  revalidatePath(`/wardrobe/${itemId}/edit`);
  return { success: true };
}

export async function deleteItem(itemId: string): Promise<ActionResult> {
  const userResult = await requireUserId();
  if (typeof userResult !== "string") {
    return userResult;
  }

  const supabase = await createClient();

  await deleteItemStorageFolder(userResult, itemId);

  const { error } = await supabase.from("items").delete().eq("id", itemId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/wardrobe");
  redirect("/wardrobe");
}
