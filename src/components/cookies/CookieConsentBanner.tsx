"use client";

import Link from "next/link";
import { useCookieConsent } from "@/lib/cookies/context";

export function CookieConsentBanner() {
  const { hasDecided, acceptAll, refuseNonEssential } = useCookieConsent();

  if (hasDecided) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-label="Consentement cookies"
      aria-live="polite"
      className="fixed inset-x-0 bottom-[var(--tab-bar-height)] z-50 border-t border-[var(--border-hairline)] bg-[var(--surface)] px-[var(--space-page-x)] py-4 shadow-[0_-4px_24px_rgba(28,27,25,0.06)] md:bottom-0"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-caption max-w-2xl text-[var(--muted)]">
          Nous utilisons des cookies essentiels pour votre session. Les cookies non essentiels
          (mesure d&apos;audience) ne seront déposés qu&apos;avec votre accord.{" "}
          <Link
            href="/confidentialite#cookies"
            className="text-[var(--foreground)] underline-offset-2 hover:underline"
          >
            Politique de confidentialité
          </Link>
        </p>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={refuseNonEssential}
            className="btn-secondary px-4 py-2.5 text-xs"
          >
            Refuser les cookies non essentiels
          </button>
          <button type="button" onClick={acceptAll} className="btn-primary px-4 py-2.5 text-xs">
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  );
}
