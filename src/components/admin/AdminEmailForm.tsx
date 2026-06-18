"use client";

import { useState, useTransition } from "react";
import { adminUpdateEmail } from "@/lib/admin/actions";

type AdminEmailFormProps = {
  userId: string;
  currentEmail: string;
};

export function AdminEmailForm({ userId, currentEmail }: AdminEmailFormProps) {
  const [email, setEmail] = useState(currentEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await adminUpdateEmail({ userId, email, password });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccess("Adresse e-mail mise à jour.");
      setPassword("");
    });
  }

  return (
    <section className="surface-panel space-y-4 p-5">
      <h3 className="text-title">Changer l&apos;e-mail</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="admin-email" className="input-label">
            Nouvelle adresse e-mail
          </label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isPending}
            className="input-field mt-1.5"
            autoComplete="off"
          />
        </div>

        <div>
          <label htmlFor="admin-email-password" className="input-label">
            Votre mot de passe administrateur
          </label>
          <input
            id="admin-email-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isPending}
            className="input-field mt-1.5"
            autoComplete="current-password"
          />
        </div>

        <button type="submit" disabled={isPending} className="btn-secondary disabled:opacity-60">
          {isPending ? "Enregistrement…" : "Mettre à jour l'e-mail"}
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
