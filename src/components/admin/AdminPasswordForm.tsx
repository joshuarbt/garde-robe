"use client";

import { useState, useTransition } from "react";
import { adminResetPassword } from "@/lib/admin/actions";

type AdminPasswordFormProps = {
  userId: string;
};

export function AdminPasswordForm({ userId }: AdminPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await adminResetPassword({ userId, password, adminPassword });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccess("Mot de passe réinitialisé.");
      setPassword("");
      setAdminPassword("");
    });
  }

  return (
    <section className="surface-panel space-y-4 p-5">
      <h3 className="text-title">Réinitialiser le mot de passe</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="admin-new-password" className="input-label">
            Nouveau mot de passe
          </label>
          <input
            id="admin-new-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isPending}
            className="input-field mt-1.5"
            autoComplete="new-password"
          />
        </div>

        <div>
          <label htmlFor="admin-password-confirm" className="input-label">
            Votre mot de passe administrateur
          </label>
          <input
            id="admin-password-confirm"
            type="password"
            value={adminPassword}
            onChange={(event) => setAdminPassword(event.target.value)}
            disabled={isPending}
            className="input-field mt-1.5"
            autoComplete="current-password"
          />
        </div>

        <button type="submit" disabled={isPending} className="btn-secondary disabled:opacity-60">
          {isPending ? "Enregistrement…" : "Réinitialiser le mot de passe"}
        </button>
      </form>

      {error ? (
        <p role="alert" className="text-status-error text-sm">
          {error}
        </p>
      ) : null}
      {success ? (
        <p role="status" className="text-caption text-[var(--status-success)]">
          {success}
        </p>
      ) : null}
    </section>
  );
}
