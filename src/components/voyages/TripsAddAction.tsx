"use client";

import Link from "next/link";
import { IconLink } from "@/components/ui/IconButton";
import { useMinWidth } from "@/hooks/useMediaQuery";
import { actionIcons } from "@/lib/icons";

const SM_BREAKPOINT = 640;

export function TripsAddAction() {
  const isSmUp = useMinWidth(SM_BREAKPOINT);

  if (isSmUp) {
    return (
      <Link href="/voyages/new" className="btn-ghost min-h-[var(--touch-min)]">
        Nouveau voyage
      </Link>
    );
  }

  return (
    <IconLink href="/voyages/new" icon={actionIcons.add} label="Nouveau voyage" />
  );
}
