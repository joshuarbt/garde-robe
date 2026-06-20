"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  adminConfirmUserEmail,
  adminResendConfirmationEmail,
} from "@/lib/admin/actions";

type AdminEmailVerificationBadgeProps = {
  isEmailConfirmed: boolean;
};

export function AdminEmailVerificationBadge({
  isEmailConfirmed,
}: AdminEmailVerificationBadgeProps) {
  if (isEmailConfirmed) {
    return (
      <span className="inline-flex items-center rounded-sm bg-[var(--status-success-bg)] px-2 py-0.5 text-caption text-[var(--status-success)]">
        Vérifié
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-sm bg-[var(--status-warning-bg)] px-2 py-0.5 text-caption text-[var(--status-warning)]">
      Non vérifié
    </span>
  );
}

type AdminEmailVerificationSectionProps = {
  userId: string;
  email: string;
  isEmailConfirmed: boolean;
  emailConfirmedAt: string | null;
};

function formatConfirmedDate(value: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AdminEmailVerificationSection({
  userId,
  email,
  isEmailConfirmed,
  emailConfirmedAt,
}: AdminEmailVerificationSectionProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifySuccess, setVerifySuccess] = useState<string | null>(null);
  const [isResendPending, startResendTransition] = useTransition();
  const [isVerifyPending, startVerifyTransition] = useTransition();

  function handleResend() {
    setResendError(null);
    setResendSuccess(null);

    startResendTransition(async () => {
      const result = await adminResendConfirmationEmail({ userId });

      if (!result.success) {
        setResendError(result.error);
        return;
      }

      setResendSuccess("E-mail de confirmation renvoyé.");
      router.refresh();
    });
  }

  function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setVerifyError(null);
    setVerifySuccess(null);

    const confirmed = window.confirm(
      `Marquer l'e-mail ${email} comme vérifié ?\n\nL'utilisateur pourra se connecter sans confirmer son adresse e-mail.`,
    );

    if (!confirmed) {
      return;
    }

    startVerifyTransition(async () => {
      const result = await adminConfirmUserEmail({ userId, password });

      if (!result.success) {
        setVerifyError(result.error);
        return;
      }

      setVerifySuccess("E-mail marqué comme vérifié.");
      setPassword("");
      router.refresh();
    });
  }

  return (
    <section className="surface-panel space-y-4 p-5">
      <div>
        <h3 className="text-title">Confirmation e-mail</h3>
        {isEmailConfirmed && emailConfirmedAt ? (
          <p className="text-caption mt-2 text-[var(--muted)]">
            Vérifié le {formatConfirmedDate(emailConfirmedAt)}
          </p>
        ) : (
          <p className="text-caption mt-2 text-[var(--muted)]">
            L&apos;utilisateur n&apos;a pas encore confirmé son adresse e-mail.
          </p>
        )}
      </div>

      {!isEmailConfirmed ? (
        <div className="space-y-6">
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleResend}
              disabled={isResendPending || isVerifyPending}
              className="btn-secondary disabled:opacity-60"
            >
              {isResendPending ? "Envoi…" : "Renvoyer l'email de confirmation"}
            </button>

            {resendError ? (
              <p role="alert" className="text-status-error text-sm">
                {resendError}
              </p>
            ) : null}
            {resendSuccess ? (
              <p role="status" className="text-caption text-[var(--status-success)]">
                {resendSuccess}
              </p>
            ) : null}
          </div>

          <form onSubmit={handleVerify} className="space-y-4 border-t border-[var(--border-hairline)] pt-4">
            <p className="text-caption text-[var(--muted)]">
              Contourner la confirmation e-mail et marquer le compte comme vérifié.
            </p>

            <div>
              <label htmlFor="admin-verify-password" className="input-label">
                Votre mot de passe administrateur
              </label>
              <input
                id="admin-verify-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isVerifyPending || isResendPending}
                className="input-field mt-1.5"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isVerifyPending || isResendPending || !password.trim()}
              className="btn-secondary disabled:opacity-60"
            >
              {isVerifyPending ? "Vérification…" : "Marquer comme vérifié"}
            </button>

            {verifyError ? (
              <p role="alert" className="text-status-error text-sm">
                {verifyError}
              </p>
            ) : null}
            {verifySuccess ? (
              <p role="status" className="text-caption text-[var(--status-success)]">
                {verifySuccess}
              </p>
            ) : null}
          </form>
        </div>
      ) : null}
    </section>
  );
}
