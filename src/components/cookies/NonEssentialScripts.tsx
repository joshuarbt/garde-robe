"use client";

import { useCookieConsent } from "@/lib/cookies/context";

/**
 * Gate for non-essential third-party scripts. Add analytics or similar SDKs here only —
 * never in layout or page components directly.
 */
export function NonEssentialScripts() {
  const { consent } = useCookieConsent();

  if (!consent?.analytics) {
    return null;
  }

  // Future: return <Analytics /> or next/script tags when a provider is added.
  return null;
}
