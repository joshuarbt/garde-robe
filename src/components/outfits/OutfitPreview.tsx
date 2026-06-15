"use client";

import { useCallback, useMemo, useState } from "react";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/lib/canvas/constants";
import {
  computeCompositionBounds,
  computeFitTransform,
} from "@/lib/outfit/preview-bounds";
import type { OutfitPreviewItem } from "@/lib/types/outfit";

type OutfitPreviewProps = {
  items: OutfitPreviewItem[];
  alt: string;
  variant?: "card" | "cell" | "chip" | "row";
  className?: string;
};

type ImageDimensions = {
  width: number;
  height: number;
};

const variantStyles = {
  card: "aspect-[4/5] w-full",
  cell: "aspect-square w-full min-h-[2.75rem] max-h-10",
  chip: "aspect-square w-9 shrink-0",
  row: "h-12 w-10 shrink-0",
} as const;

const compactVariants = new Set<OutfitPreviewProps["variant"]>(["cell", "chip", "row"]);

export function OutfitPreview({
  items,
  alt,
  variant = "card",
  className = "",
}: OutfitPreviewProps) {
  const [dimensions, setDimensions] = useState<Record<string, ImageDimensions>>({});
  const [failedIds, setFailedIds] = useState<Set<string>>(() => new Set());

  const visibleItems = useMemo(
    () => items.filter((item) => !failedIds.has(item.itemId)),
    [failedIds, items],
  );

  const loadedItems = useMemo(
    () => visibleItems.filter((item) => dimensions[item.itemId]),
    [dimensions, visibleItems],
  );

  const handleLoad = useCallback((itemId: string, event: React.SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    setDimensions((current) => ({
      ...current,
      [itemId]: {
        width: image.naturalWidth,
        height: image.naturalHeight,
      },
    }));
  }, []);

  const handleError = useCallback((itemId: string) => {
    setFailedIds((current) => {
      const next = new Set(current);
      next.add(itemId);
      return next;
    });
  }, []);

  const fitTransform = useMemo(() => {
    if (variant === "card" || !compactVariants.has(variant) || loadedItems.length === 0) {
      return null;
    }

    const bounds = computeCompositionBounds(
      loadedItems.map((item) => ({
        x: item.x,
        y: item.y,
        scale: item.scale,
        rotation: item.rotation,
        width: dimensions[item.itemId]!.width,
        height: dimensions[item.itemId]!.height,
      })),
    );

    if (!bounds) {
      return null;
    }

    return computeFitTransform(bounds);
  }, [dimensions, loadedItems, variant]);

  const compositionStyle = useMemo(() => {
    if (variant === "card") {
      return {
        transform: "scale(0.92)",
        transformOrigin: "center center",
      };
    }

    if (!fitTransform) {
      return undefined;
    }

    return {
      transform: `translate(${fitTransform.translateX}%, ${fitTransform.translateY}%) scale(${fitTransform.scale})`,
      transformOrigin: `${fitTransform.originX}% ${fitTransform.originY}%`,
    };
  }, [fitTransform, variant]);

  const isLoading =
    visibleItems.length > 0 &&
    !visibleItems.some((item) => dimensions[item.itemId]);

  if (visibleItems.length === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-[var(--surface-muted)] text-sm text-[var(--muted)] ${variantStyles[variant]} ${className}`.trim()}
        aria-label={alt}
      >
        {variant === "chip" || variant === "cell" ? null : "Pas de photo"}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-[var(--surface-muted)] ${variantStyles[variant]} ${className}`.trim()}
      aria-label={alt}
      role="img"
    >
      {isLoading ? (
        <div className="absolute inset-0 animate-pulse bg-[var(--surface-muted)]" aria-hidden />
      ) : null}

      <div className="absolute inset-0" style={compositionStyle}>
        {[...visibleItems]
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((item) => {
            const natural = dimensions[item.itemId];
            const widthPercent = natural
              ? (natural.width * item.scale / CANVAS_WIDTH) * 100
              : 20;

            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={item.itemId}
                src={item.imageUrl}
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
                onLoad={(event) => handleLoad(item.itemId, event)}
                onError={() => handleError(item.itemId)}
                className="absolute max-w-none select-none"
                style={{
                  left: `${(item.x / CANVAS_WIDTH) * 100}%`,
                  top: `${(item.y / CANVAS_HEIGHT) * 100}%`,
                  width: `${widthPercent}%`,
                  height: "auto",
                  transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
                  transformOrigin: "center center",
                  opacity: natural ? 1 : 0,
                  zIndex: item.zIndex,
                }}
              />
            );
          })}
      </div>
    </div>
  );
}
