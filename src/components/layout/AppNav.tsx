import Link from "next/link";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { NavLink } from "@/components/layout/NavLink";
import { hasPublicEnv } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/wardrobe", label: "Wardrobe" },
  { href: "/outfits", label: "Outfits" },
  { href: "/calendar", label: "Calendar" },
  { href: "/dashboard", label: "Dashboard" },
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
    <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--background)]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <Link
          href="/"
          className="font-display text-xl tracking-wide text-[var(--foreground)] transition-opacity hover:opacity-70"
        >
          Garde-robe
        </Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {navLinks.map(({ href, label }) => (
            <NavLink key={href} href={href} label={label} />
          ))}
          {user ? (
            <SignOutButton />
          ) : (
            <>
              <Link href="/login" className="label-caps transition-opacity hover:opacity-70">
                Login
              </Link>
              <Link href="/signup" className="label-caps transition-opacity hover:opacity-70">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
