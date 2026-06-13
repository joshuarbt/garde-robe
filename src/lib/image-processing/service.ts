import { MAX_PROCESSING_ATTEMPTS } from "@/lib/image-processing/constants";
import type {
  EnqueueBackgroundRemovalResult,
  ImageProcessingStatus,
} from "@/lib/image-processing/types";
import { buildItemProcessedPath } from "@/lib/storage/paths";
import type { ItemImageProcessingFields } from "@/lib/types/item";

export type ImageProcessingUpdatePayload = {
  processed_image_path: string | null;
  image_processing_status: ImageProcessingStatus;
  image_processing_error: string | null;
  image_processing_attempts: number;
  image_processing_updated_at: string;
};

export function getInitialProcessingStatus(
  removeBackground: boolean,
): Extract<ImageProcessingStatus, "none" | "pending"> {
  return removeBackground ? "pending" : "none";
}

export function resetImageProcessingState(
  removeBackground: boolean,
): ImageProcessingUpdatePayload {
  return {
    processed_image_path: null,
    image_processing_status: getInitialProcessingStatus(removeBackground),
    image_processing_error: null,
    image_processing_attempts: 0,
    image_processing_updated_at: new Date().toISOString(),
  };
}

export function markProcessingCompleted(
  item: Pick<ItemImageProcessingFields, "user_id" | "id">,
): ImageProcessingUpdatePayload {
  return {
    processed_image_path: buildItemProcessedPath(item.user_id, item.id),
    image_processing_status: "completed",
    image_processing_error: null,
    image_processing_attempts: 0,
    image_processing_updated_at: new Date().toISOString(),
  };
}

export function markProcessingFailed(
  currentAttempts: number,
  error: string,
): ImageProcessingUpdatePayload {
  return {
    processed_image_path: null,
    image_processing_status: "failed",
    image_processing_error: error,
    image_processing_attempts: currentAttempts + 1,
    image_processing_updated_at: new Date().toISOString(),
  };
}

export function canRetryProcessing(attempts: number): boolean {
  return attempts < MAX_PROCESSING_ATTEMPTS;
}

export async function enqueueBackgroundRemoval(
  itemId: string,
): Promise<EnqueueBackgroundRemovalResult> {
  void itemId;
  return { queued: false, reason: "not_implemented" };
}

export function buildProcessingStatusUpdate(
  status: ImageProcessingStatus,
): Pick<ImageProcessingUpdatePayload, "image_processing_status" | "image_processing_updated_at"> {
  return {
    image_processing_status: status,
    image_processing_updated_at: new Date().toISOString(),
  };
}
