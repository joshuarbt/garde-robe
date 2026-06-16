import { compressImageFile } from "@/lib/images/compress";
import { MAX_COMPRESSED_IMAGE_FILE_SIZE } from "@/lib/storage/image-validation";

const DEFAULT_ERROR =
  "Impossible de supprimer l'arrière-plan. Réessayez ou conservez l'original.";

export async function fetchImageUrlAsFile(
  url: string,
  filename: string,
): Promise<{ file: File } | { error: string }> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      return {
        error:
          "Impossible de charger l'image enregistrée. Actualisez la page et réessayez.",
      };
    }

    const blob = await response.blob();
    const type = blob.type || "image/jpeg";

    return {
      file: new File([blob], filename, { type }),
    };
  } catch {
    return {
      error:
        "Impossible de charger l'image enregistrée. Actualisez la page et réessayez.",
    };
  }
}

async function prepareFileForBackgroundRemoval(file: File): Promise<File | { error: string }> {
  if (file.size <= MAX_COMPRESSED_IMAGE_FILE_SIZE) {
    return file;
  }

  try {
    return await compressImageFile(file);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Impossible d'optimiser l'image avant la suppression d'arrière-plan.",
    };
  }
}

export async function removeBackgroundFromFile(
  file: File,
): Promise<{ blob: Blob } | { error: string }> {
  const prepared = await prepareFileForBackgroundRemoval(file);

  if ("error" in prepared) {
    return prepared;
  }

  try {
    const formData = new FormData();
    formData.append("file", prepared);

    const response = await fetch("/api/images/remove-background", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let message = DEFAULT_ERROR;

      try {
        const payload = (await response.json()) as { error?: string };
        if (payload.error) {
          message = payload.error;
        }
      } catch {
        // Keep default message when body is not JSON.
      }

      return { error: message };
    }

    const blob = await response.blob();
    return { blob };
  } catch {
    return { error: DEFAULT_ERROR };
  }
}
