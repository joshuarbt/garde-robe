"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  label: string;
};

export function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`text-caption relative pb-0.5 font-normal transition-opacity hover:opacity-70 ${
        isActive ? "text-[var(--foreground)]" : "text-[var(--muted)]"
      }`}
    >
      {label}
      {isActive ? (
        <span className="absolute -bottom-1 left-0 h-px w-full bg-[var(--accent)]" />
      ) : null}
    </Link>
  );
}
