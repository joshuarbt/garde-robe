"use client";

import { ItemImage } from "@/components/wardrobe/ItemImage";

type PackingListItemProps = {
  name: string;
  imageUrl: string | null;
  isPacked: boolean;
  disabled?: boolean;
  onToggle: () => void;
};

export function PackingListItem({
  name,
  imageUrl,
  isPacked,
  disabled = false,
  onToggle,
}: PackingListItemProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`flex min-h-[var(--touch-min)] w-full items-center gap-3 rounded-sm border border-[var(--border-hairline)] px-3 py-2 text-left transition-opacity disabled:opacity-60 ${
        isPacked ? "bg-[var(--surface-muted)] opacity-70" : "bg-[var(--surface)]"
      }`}
    >
      <ItemImage
        src={imageUrl}
        alt={name}
        className="h-12 w-12 shrink-0 border border-[var(--border-subtle)]"
        sizes="48px"
      />
      <span
        className={`flex-1 text-body ${isPacked ? "text-[var(--muted)] line-through" : "text-[var(--foreground)]"}`}
      >
        {name}
      </span>
      <span
        aria-hidden="true"
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border transition-colors duration-200 ${
          isPacked
            ? "border-[var(--foreground)] bg-[var(--foreground)] text-white"
            : "border-[var(--border-subtle)] bg-[var(--background)]"
        }`}
      >
        {isPacked ? (
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 8.5 6.5 12 13 4" />
          </svg>
        ) : null}
      </span>
    </button>
  );
}
