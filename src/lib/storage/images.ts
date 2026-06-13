import { ITEM_IMAGES_BUCKET } from "@/lib/storage/paths";
import { createClient } from "@/lib/supabase/server";

const SIGNED_URL_EXPIRY_SECONDS = 60 * 60;

export async function getItemImageUrl(
  imagePath: string | null,
): Promise<string | null> {
  if (!imagePath) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(ITEM_IMAGES_BUCKET)
    .createSignedUrl(imagePath, SIGNED_URL_EXPIRY_SECONDS);

  if (error || !data?.signedUrl) {
    return null;
  }

  return data.signedUrl;
}
