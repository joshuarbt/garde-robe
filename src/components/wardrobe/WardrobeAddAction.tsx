"use client";

import Link from "next/link";
import { IconLink } from "@/components/ui/IconButton";
import { useMinWidth } from "@/hooks/useMediaQuery";
import { actionIcons } from "@/lib/icons";

const SM_BREAKPOINT = 640;

export function WardrobeAddAction() {
  const isSmUp = useMinWidth(SM_BREAKPOINT);

  if (isSmUp) {
    return (
      <Link href="/wardrobe/new" className="btn-ghost min-h-[var(--touch-min)]">
        Ajouter
      </Link>
    );
  }

  return (
    <IconLink
      href="/wardrobe/new"
      icon={actionIcons.add}
      label="Ajouter un vêtement"
    />
  );
}
