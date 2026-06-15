"use client";

import Link from "next/link";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { getConsentStatusLabel } from "@/lib/cookies/consent";
import { useCookieConsent } from "@/lib/cookies/context";
import { NON_ESSENTIAL_CATEGORIES } from "@/lib/cookies/non-essential";

export function CookieConsentPreferences() {
  const {
    consent,
    preferencesOpen,
    closePreferences,
    acceptAll,
    refuseNonEssential,
  } = useCookieConsent();

  const footer = (
    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={refuseNonEssential}
        className="btn-secondary w-full sm:w-auto"
      >
        Refuser les cookies non essentiels
      </button>
      <button type="button" onClick={acceptAll} className="btn-primary w-full sm:w-auto">
        Tout accepter
      </button>
    </div>
  );

  return (
    <BottomSheet
      open={preferencesOpen}
      onClose={closePreferences}
      title="Préférences cookies"
      titleId="cookie-preferences-title"
      footer={footer}
      className="rounded-t-xl md:rounded-sm"
    >
      <div className="space-y-6">
        <p className="text-caption text-[var(--muted)]">
          Les cookies essentiels (session) sont toujours actifs pour que le service fonctionne.
          Vous pouvez accepter ou refuser les cookies non essentiels ci-dessous.{" "}
          <Link href="/confidentialite#cookies" className="underline-offset-2 hover:underline">
            Politique de confidentialité
          </Link>
        </p>

        {consent ? (
          <p className="text-sm text-[var(--foreground)]">
            Choix actuel :{" "}
            <span className="text-[var(--muted)]">
              {getConsentStatusLabel(consent.analytics)}
            </span>
          </p>
        ) : (
          <p className="text-sm text-[var(--muted)]">Aucun choix enregistré pour l&apos;instant.</p>
        )}

        <div className="space-y-2 border-t border-[var(--border-hairline)] pt-6">
          <p className="text-overline">Cookies non essentiels</p>
          <p className="text-sm font-medium text-[var(--foreground)]">
            {NON_ESSENTIAL_CATEGORIES.analytics.label}
          </p>
          <p className="text-caption text-[var(--muted)]">
            {NON_ESSENTIAL_CATEGORIES.analytics.description}
          </p>
        </div>
      </div>
    </BottomSheet>
  );
}
