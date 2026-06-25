import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavLink } from "@/components/layout/NavLink";
import { hasPublicEnv } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

const desktopNavLinks = [
  { href: "/wardrobe", label: "Garde-robe" },
  { href: "/outfits", label: "Tenues" },
  { href: "/calendar", label: "Calendrier" },
  { href: "/voyages", label: "Voyages" },
  { href: "/dashboard", label: "Collection" },
] as const;

export async function AppNav() {
  let user = null;

  if (hasPublicEnv()) {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-hairline)] bg-[var(--background)]">
      <div
        className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-[var(--space-page-x)]"
        style={{ minHeight: "var(--header-height)" }}
      >
        <Link
          href={user ? "/wardrobe" : "/"}
          className="font-display text-lg tracking-wide text-[var(--foreground)] transition-opacity hover:opacity-70 md:text-xl"
        >
          Garde-robe
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <nav className="hidden items-center gap-x-6 md:flex" aria-label="Navigation principale">
              {desktopNavLinks.map(({ href, label }) => (
                <NavLink key={href} href={href} label={label} />
              ))}
            </nav>
          ) : (
            <div className="hidden items-center gap-x-5 md:flex">
              <Link href="/login" className="text-caption transition-opacity hover:opacity-70">
                Se connecter
              </Link>
              <Link href="/signup" className="btn-primary btn-sm text-xs">
                Créer un compte
              </Link>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
