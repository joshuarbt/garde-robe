"use client";

import Link from "next/link";
import { IconLink } from "@/components/ui/IconButton";
import { useMinWidth } from "@/hooks/useMediaQuery";
import { actionIcons } from "@/lib/icons";

const SM_BREAKPOINT = 640;

export function OutfitsAddAction() {
  const isSmUp = useMinWidth(SM_BREAKPOINT);

  if (isSmUp) {
    return (
      <Link href="/outfits/new" className="btn-ghost min-h-[var(--touch-min)]">
        Nouvelle tenue
      </Link>
    );
  }

  return (
    <IconLink
      href="/outfits/new"
      icon={actionIcons.add}
      label="Composer une tenue"
    />
  );
}
