import type Konva from "konva";

export function downloadStagePng(
  stage: Konva.Stage,
  filename = "outfit.png",
): void {
  const dataUrl = stage.toDataURL({ pixelRatio: 2 });
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
