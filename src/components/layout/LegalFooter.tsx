import Link from "next/link";

const linkClass =
  "inline-flex min-h-[44px] items-center px-1 transition-opacity hover:text-[var(--foreground)] hover:opacity-80";

export function LegalFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border-hairline)] px-[var(--space-page-x)] py-4 pb-tab-bar md:pb-6">
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
