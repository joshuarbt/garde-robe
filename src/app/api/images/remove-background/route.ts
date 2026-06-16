import { hasKnockoutToken } from "@/lib/env/knockout";
import { removeBackgroundFromBuffer } from "@/lib/image-processing/knockout";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_COMPRESSED_IMAGE_FILE_SIZE,
  type AllowedImageType,
} from "@/lib/storage/image-validation";
import { createClient } from "@/lib/supabase/server";

function validateUploadedFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as AllowedImageType)) {
    return "L'image doit être au format JPEG, PNG ou WebP.";
  }

  if (file.size > MAX_COMPRESSED_IMAGE_FILE_SIZE) {
    return "L'image optimisée est trop volumineuse. Choisissez une photo plus petite.";
  }

  return null;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Non autorisé." }, { status: 401 });
  }

  if (!hasKnockoutToken()) {
    return Response.json(
      { error: "La suppression d'arrière-plan n'est pas disponible pour le moment." },
      { status: 503 },
    );
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "Aucune image fournie." }, { status: 400 });
  }

  const validationError = validateUploadedFile(file);
  if (validationError) {
    return Response.json({ error: validationError }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const png = await removeBackgroundFromBuffer(buffer, file.name || "image.jpg");

    return new Response(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Impossible de supprimer l'arrière-plan. Réessayez ou conservez l'original.";

    return Response.json({ error: message }, { status: 502 });
  }
}
