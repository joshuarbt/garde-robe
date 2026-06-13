"use client";

import { resizeImageFile } from "@/lib/images/client";
import {
  buildItemOriginalPath,
  getExtensionForMimeType,
  ITEM_IMAGES_BUCKET,
} from "@/lib/storage/paths";
import { validateImageFile } from "@/lib/storage/image-validation";
import { createClient } from "@/lib/supabase/client";

export async function uploadItemImage(
  file: File,
  userId: string,
  itemId: string,
): Promise<{ path: string } | { error: string }> {
  const validationError = validateImageFile(file);
  if (validationError) {
    return { error: validationError };
  }

  let processedFile: File;

  try {
    processedFile = await resizeImageFile(file);
  } catch {
    return { error: "Could not process image." };
  }

  const extension = getExtensionForMimeType(processedFile.type);
  const path = buildItemOriginalPath(userId, itemId, extension);
  const supabase = createClient();

  const { error } = await supabase.storage
    .from(ITEM_IMAGES_BUCKET)
    .upload(path, processedFile, {
      upsert: true,
      contentType: processedFile.type,
    });

  if (error) {
    return { error: error.message };
  }

  return { path };
}
