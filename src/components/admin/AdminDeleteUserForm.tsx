"use client";

import { useState, useTransition } from "react";
import { adminDeleteUser } from "@/lib/admin/actions";
import { DELETE_CONFIRMATION } from "@/lib/privacy/constants";

type AdminDeleteUserFormProps = {
  userId: string;
  email: string;
};

export function AdminDeleteUserForm({ userId, email }: AdminDeleteUserFormProps) {
  const [confirmation, setConfirmation] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const canSubmit =
    confirmation.trim() === DELETE_CONFIRMATION && password.trim().length > 0 && !isPending;

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await adminDeleteUser({ userId, confirmation, password });

      if (!result.success) {
        setError(result.error);
      }
    });
  }

  return (
    <section className="space-y-4 border-t border-[var(--border-hairline)] pt-8">
      <div>
        <h3 className="text-title text-[var(--status-error)]">Supprimer l&apos;utilisateur</h3>
        <p className="text-caption mt-2 text-[var(--muted)]">
          Supprime définitivement le compte <span className="text-[var(--foreground)]">{email}</span>
          , toutes ses données et ses fichiers. Irréversible.
        </p>
      </div>

      <div className="space-y-4 max-w-md">
        <div>
          <label htmlFor="admin-delete-confirmation" className="input-label">
            Saisissez {DELETE_CONFIRMATION} pour confirmer
          </label>
          <input
            id="admin-delete-confirmation"
            type="text"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            disabled={isPending}
            className="input-field mt-1.5"
            autoComplete="off"
          />
        </div>

        <div>
          <label htmlFor="admin-delete-password" className="input-label">
            Votre mot de passe administrateur
          </label>
          <input
            id="admin-delete-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isPending}
            className="input-field mt-1.5"
            autoComplete="current-password"
          />
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={!canSubmit}
          className="btn-destructive disabled:opacity-60"
        >
          {isPending ? "Suppression…" : "Supprimer l'utilisateur"}
        </button>
      </div>

      {error ? (
        <p role="alert" className="text-status-error text-sm">
          {error}
        </p>
      ) : null}
    </section>
  );
}
