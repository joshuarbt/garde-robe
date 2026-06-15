"use client";

import { getConsentStatusLabel } from "@/lib/cookies/consent";
import { useCookieConsent } from "@/lib/cookies/context";

export function CookiePreferencesSection() {
  const { consent, openPreferences } = useCookieConsent();

  return (
    <section className="space-y-4 border-t border-[var(--border-hairline)] pt-8">
      <div>
        <h2 className="text-title">Préférences cookies</h2>
        <p className="text-caption mt-2 text-[var(--muted)]">
          Les cookies essentiels restent actifs. Vous pouvez modifier votre choix concernant les
          cookies non essentiels à tout moment.
        </p>
      </div>

      <p className="text-sm text-[var(--foreground)]">
        {consent ? (
          <>
            Choix actuel :{" "}
            <span className="text-[var(--muted)]">
              {getConsentStatusLabel(consent.analytics)}
            </span>
          </>
        ) : (
          <span className="text-[var(--muted)]">Aucun choix enregistré</span>
        )}
      </p>

      <button type="button" onClick={openPreferences} className="btn-secondary">
        Modifier mes préférences
      </button>
    </section>
  );
}
