import Link from "next/link";
import { NavLink } from "@/components/layout/NavLink";
import { hasPublicEnv } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

const desktopNavLinks = [
  { href: "/wardrobe", label: "Wardrobe" },
  { href: "/outfits", label: "Outfits" },
  { href: "/calendar", label: "Calendar" },
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
        className="mx-auto flex max-w-5xl items-center justify-between px-[var(--space-page-x)]"
        style={{ minHeight: "var(--header-height)" }}
      >
        <Link
          href={user ? "/wardrobe" : "/"}
          className="font-display text-lg tracking-wide text-[var(--foreground)] transition-opacity hover:opacity-70 md:text-xl"
        >
          Garde-robe
        </Link>

        {user ? (
          <nav className="hidden items-center gap-x-6 md:flex" aria-label="Main navigation">
            {desktopNavLinks.map(({ href, label }) => (
              <NavLink key={href} href={href} label={label} />
            ))}
          </nav>
        ) : (
          <div className="hidden items-center gap-x-5 md:flex">
            <Link href="/login" className="text-caption transition-opacity hover:opacity-70">
              Login
            </Link>
            <Link href="/signup" className="btn-primary px-4 py-2 text-xs">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
