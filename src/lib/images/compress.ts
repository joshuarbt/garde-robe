import imageCompression from "browser-image-compression";
import {
  MAX_COMPRESSED_IMAGE_FILE_SIZE,
  TARGET_COMPRESSED_IMAGE_FILE_SIZE,
} from "@/lib/storage/image-validation";

export const MAX_OUTPUT_DIMENSION = 1500;
export const OUTPUT_MIME_TYPE = "image/webp";
const OUTPUT_QUALITY = 0.8;

const COMPRESSION_TOO_LARGE_ERROR =
  "L'image optimisée est trop volumineuse. Choisissez une photo plus petite.";

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Impossible de lire le fichier image."));
    };

    image.src = url;
  });
}

async function readImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  const image = await loadImageFromFile(file);
  return { width: image.width, height: image.height };
}

function toOutputFile(blob: Blob, originalName: string): File {
  const baseName = originalName.replace(/\.[^.]+$/, "") || "item";
  return new File([blob], `${baseName}.webp`, { type: OUTPUT_MIME_TYPE });
}

async function compressWithOptions(
  file: File,
  maxSizeMB: number,
  initialQuality: number,
): Promise<File> {
  const compressed = await imageCompression(file, {
    maxSizeMB,
    maxWidthOrHeight: MAX_OUTPUT_DIMENSION,
    useWebWorker: true,
    fileType: OUTPUT_MIME_TYPE,
    initialQuality,
  });

  return compressed instanceof File
    ? compressed
    : toOutputFile(compressed, file.name);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} o`;
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} Ko`;
  }

  const megabytes = bytes / (1024 * 1024);
  return `${megabytes.toFixed(1).replace(".", ",")} Mo`;
}

export async function compressImageFile(file: File): Promise<File> {
  if (file.type === OUTPUT_MIME_TYPE && file.size <= TARGET_COMPRESSED_IMAGE_FILE_SIZE) {
    const { width, height } = await readImageDimensions(file);
    if (width <= MAX_OUTPUT_DIMENSION && height <= MAX_OUTPUT_DIMENSION) {
      return file;
    }
  }

  let compressed = await compressWithOptions(
    file,
    TARGET_COMPRESSED_IMAGE_FILE_SIZE / (1024 * 1024),
    OUTPUT_QUALITY,
  );

  if (compressed.size > MAX_COMPRESSED_IMAGE_FILE_SIZE) {
    compressed = await compressWithOptions(compressed, 0.9, 0.7);
  }

  if (compressed.size > MAX_COMPRESSED_IMAGE_FILE_SIZE) {
    throw new Error(COMPRESSION_TOO_LARGE_ERROR);
  }

  return compressed;
}
