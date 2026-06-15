export const CONSENT_STORAGE_KEY = "garde-robe-cookie-consent";
export const CONSENT_VERSION = 1 as const;
export const CONSENT_CHANGE_EVENT = "garde-robe-cookie-consent-change";

export type CookieConsent = {
  v: typeof CONSENT_VERSION;
  essential: true;
  analytics: boolean;
  decidedAt: string;
};

function isValidConsent(value: unknown): value is CookieConsent {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    record.v === CONSENT_VERSION &&
    record.essential === true &&
    typeof record.analytics === "boolean" &&
    typeof record.decidedAt === "string"
  );
}

export function readConsent(): CookieConsent | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!isValidConsent(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(analytics: boolean): CookieConsent {
  const consent: CookieConsent = {
    v: CONSENT_VERSION,
    essential: true,
    analytics,
    decidedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
      window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
    } catch {
      // ignore storage failures
    }
  }

  return consent;
}

export function hasConsentDecision(): boolean {
  return readConsent() !== null;
}

export function subscribeConsent(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(CONSENT_CHANGE_EVENT, onStoreChange);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onStoreChange);
}

export function getConsentStatusLabel(analytics: boolean): string {
  return analytics
    ? "Cookies non essentiels acceptés"
    : "Cookies non essentiels refusés";
}
