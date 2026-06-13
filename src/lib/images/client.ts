const MAX_IMAGE_DIMENSION = 1200;
const JPEG_QUALITY = 0.85;

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
      reject(new Error("Could not read image file."));
    };

    image.src = url;
  });
}

function getOutputType(file: File): { type: string; extension: string } {
  if (file.type === "image/png") {
    return { type: "image/png", extension: "png" };
  }

  if (file.type === "image/webp") {
    return { type: "image/webp", extension: "webp" };
  }

  return { type: "image/jpeg", extension: "jpg" };
}

export async function resizeImageFile(file: File): Promise<File> {
  const image = await loadImageFromFile(file);
  const scale = Math.min(
    1,
    MAX_IMAGE_DIMENSION / Math.max(image.width, image.height),
  );
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not process image.");
  }

  context.drawImage(image, 0, 0, width, height);

  const { type, extension } = getOutputType(file);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error("Could not compress image."));
          return;
        }

        resolve(result);
      },
      type,
      type === "image/jpeg" ? JPEG_QUALITY : undefined,
    );
  });

  const baseName = file.name.replace(/\.[^.]+$/, "") || "item";

  return new File([blob], `${baseName}.${extension}`, { type });
}
