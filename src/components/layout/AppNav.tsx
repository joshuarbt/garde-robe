import Link from "next/link";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { hasPublicEnv } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/wardrobe", label: "Wardrobe" },
  { href: "/outfits", label: "Outfits" },
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
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="text-lg font-medium tracking-tight text-stone-900">
          Garde-robe
        </Link>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-stone-600">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="transition-colors hover:text-stone-900"
            >
              {label}
            </Link>
          ))}
          {user ? (
            <SignOutButton />
          ) : (
            <>
              <Link href="/login" className="transition-colors hover:text-stone-900">
                Login
              </Link>
              <Link href="/signup" className="transition-colors hover:text-stone-900">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
