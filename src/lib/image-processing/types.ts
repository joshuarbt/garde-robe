import type { ImageProcessingStatus } from "@/lib/types/item";

export type { ImageProcessingStatus };

export type BackgroundRemovalInput = {
  sourceUrl: string;
  itemId: string;
  userId: string;
};

export type BackgroundRemovalResult = {
  outputBuffer: ArrayBuffer;
  contentType: string;
};

export interface BackgroundRemovalProvider {
  removeBackground(input: BackgroundRemovalInput): Promise<BackgroundRemovalResult>;
}

export type EnqueueBackgroundRemovalResult =
  | { queued: true }
  | { queued: false; reason: string };
