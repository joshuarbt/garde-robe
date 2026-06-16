"use client";

import { PROCESSED_IMAGE_CONTENT_TYPE } from "@/lib/image-processing/constants";
import {
  buildItemOriginalPath,
  buildItemProcessedPath,
  getExtensionForMimeType,
  ITEM_IMAGES_BUCKET,
} from "@/lib/storage/paths";
import { validateCompressedImageFile } from "@/lib/storage/image-validation";
import { createClient } from "@/lib/supabase/client";

export async function uploadItemImage(
  file: File,
  userId: string,
  itemId: string,
): Promise<{ path: string } | { error: string }> {
  const validationError = validateCompressedImageFile(file);
  if (validationError) {
    return { error: validationError };
  }

  const extension = getExtensionForMimeType(file.type);
  const path = buildItemOriginalPath(userId, itemId, extension);
  const supabase = createClient();

  const { error } = await supabase.storage
    .from(ITEM_IMAGES_BUCKET)
    .upload(path, file, {
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    return { error: error.message };
  }

  return { path };
}

export async function uploadProcessedItemImage(
  pngBlob: Blob,
  userId: string,
  itemId: string,
): Promise<{ path: string } | { error: string }> {
  const path = buildItemProcessedPath(userId, itemId);
  const supabase = createClient();

  const { error } = await supabase.storage.from(ITEM_IMAGES_BUCKET).upload(path, pngBlob, {
    upsert: true,
    contentType: PROCESSED_IMAGE_CONTENT_TYPE,
  });

  if (error) {
    return { error: error.message };
  }

  return { path };
}
