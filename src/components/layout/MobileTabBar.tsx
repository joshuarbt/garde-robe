"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { navIcons } from "@/lib/icons";
import { isFocusRoute } from "@/lib/navigation/focus-routes";
import { isTabBarRoute } from "@/lib/navigation/tab-bar-routes";

const tabs = [
  { href: "/wardrobe", label: "Garde-robe", icon: navIcons.wardrobe },
  { href: "/outfits", label: "Tenues", icon: navIcons.outfits },
  { href: "/calendar", label: "Calendrier", icon: navIcons.calendar },
  { href: "/voyages", label: "Valise", icon: navIcons.voyages },
  { href: "/dashboard", label: "Collection", icon: navIcons.collection },
] as const;

function isTabActive(pathname: string, href: string): boolean {
  if (href === "/wardrobe") {
    return pathname === "/wardrobe" || pathname.startsWith("/wardrobe/");
  }

  if (href === "/outfits") {
    return (
      pathname === "/outfits" ||
      (pathname.startsWith("/outfits/") && !isFocusRoute(pathname))
    );
  }

  if (href === "/voyages") {
    return pathname === "/voyages" || pathname.startsWith("/voyages/");
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileTabBar() {
  const pathname = usePathname();
  const isDesktop = useIsDesktop();

  if (isDesktop || !isTabBarRoute(pathname)) {
    return null;
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border-hairline)] bg-[var(--background)]"
      aria-label="Navigation principale"
    >
      <div
        className="mx-auto flex max-w-lg items-stretch justify-around px-1"
        style={{ minHeight: "var(--tab-bar-height)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {tabs.map(({ href, label, icon }) => {
          const active = isTabActive(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex min-h-[var(--touch-min)] flex-1 flex-col items-center justify-center gap-0.5 px-1 py-1 transition-opacity ${
                active ? "text-[var(--foreground)]" : "text-[var(--muted)]"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon icon={icon} size="md" weight={active ? "active" : "regular"} />
              <span className="text-[0.625rem] font-normal tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
