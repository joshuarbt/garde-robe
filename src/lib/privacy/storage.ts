import type { SupabaseClient } from "@supabase/supabase-js";
import { ITEM_IMAGES_BUCKET } from "@/lib/storage/paths";

const REMOVE_BATCH_SIZE = 100;

async function collectUserStoragePaths(
  supabase: SupabaseClient,
  userId: string,
): Promise<string[]> {
  const { data: itemFolders, error: listError } = await supabase.storage
    .from(ITEM_IMAGES_BUCKET)
    .list(userId);

  if (listError) {
    throw new Error(listError.message);
  }

  if (!itemFolders?.length) {
    return [];
  }

  const paths: string[] = [];

  for (const folder of itemFolders) {
    const prefix = `${userId}/${folder.name}`;
    const { data: files, error: filesError } = await supabase.storage
      .from(ITEM_IMAGES_BUCKET)
      .list(prefix);

    if (filesError) {
      throw new Error(filesError.message);
    }

    for (const file of files ?? []) {
      paths.push(`${prefix}/${file.name}`);
    }
  }

  return paths;
}

export async function deleteAllUserStorage(
  supabase: SupabaseClient,
  userId: string,
): Promise<void> {
  const paths = await collectUserStoragePaths(supabase, userId);

  if (paths.length === 0) {
    return;
  }

  for (let i = 0; i < paths.length; i += REMOVE_BATCH_SIZE) {
    const batch = paths.slice(i, i + REMOVE_BATCH_SIZE);
    const { error: removeError } = await supabase.storage
      .from(ITEM_IMAGES_BUCKET)
      .remove(batch);

    if (removeError) {
      throw new Error(removeError.message);
    }
  }
}
