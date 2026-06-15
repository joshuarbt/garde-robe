"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  type CookieConsent,
  readConsent,
  subscribeConsent,
  writeConsent,
} from "@/lib/cookies/consent";

type CookieConsentContextValue = {
  consent: CookieConsent | null;
  hasDecided: boolean;
  preferencesOpen: boolean;
  acceptAll: () => void;
  refuseNonEssential: () => void;
  openPreferences: () => void;
  closePreferences: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

function getServerConsentSnapshot(): CookieConsent | null {
  return null;
}

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const consent = useSyncExternalStore(
    subscribeConsent,
    readConsent,
    getServerConsentSnapshot,
  );
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  const acceptAll = useCallback(() => {
    writeConsent(true);
    setPreferencesOpen(false);
  }, []);

  const refuseNonEssential = useCallback(() => {
    writeConsent(false);
    setPreferencesOpen(false);
  }, []);

  const openPreferences = useCallback(() => {
    setPreferencesOpen(true);
  }, []);

  const closePreferences = useCallback(() => {
    setPreferencesOpen(false);
  }, []);

  const value = useMemo(
    (): CookieConsentContextValue => ({
      consent,
      hasDecided: consent !== null,
      preferencesOpen,
      acceptAll,
      refuseNonEssential,
      openPreferences,
      closePreferences,
    }),
    [
      acceptAll,
      closePreferences,
      consent,
      openPreferences,
      preferencesOpen,
      refuseNonEssential,
    ],
  );

  return (
    <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>
  );
}

export function useCookieConsent(): CookieConsentContextValue {
  const context = useContext(CookieConsentContext);

  if (!context) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }

  return context;
}
