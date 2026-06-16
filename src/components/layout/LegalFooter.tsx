"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { isFocusRoute } from "@/lib/navigation/focus-routes";
import { isTabBarRoute } from "@/lib/navigation/tab-bar-routes";

const linkClass =
  "inline-flex min-h-[44px] items-center px-1 transition-opacity hover:text-[var(--foreground)] hover:opacity-80";

export function LegalFooter() {
  const pathname = usePathname();
  const isDesktop = useIsDesktop();

  if (isFocusRoute(pathname)) {
    return null;
  }

  const showTabBarClearance = !isDesktop && isTabBarRoute(pathname);

  return (
    <footer
      className={`mt-auto border-t border-[var(--border-hairline)] px-[var(--space-page-x)] py-4 ${
        showTabBarClearance ? "pb-tab-bar" : ""
      } md:pb-6`.trim()}
    >
      <nav
        className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-1 gap-y-1 text-caption text-[var(--muted)]"
        aria-label="Informations légales"
      >
        <Link href="/confidentialite" className={linkClass}>
          Politique de confidentialité
        </Link>
        <span aria-hidden="true" className="text-[var(--muted-light)]">
          ·
        </span>
        <Link href="/cgu" className={linkClass}>
          Conditions d&apos;utilisation
        </Link>
      </nav>
    </footer>
  );
}
