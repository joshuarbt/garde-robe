"use client";

import { useState, useTransition } from "react";
import { legalConfig } from "@/lib/legal/config";
import { DELETE_CONFIRMATION } from "@/lib/privacy/constants";
import { deleteUserAccount } from "@/lib/privacy/actions";

const DELETED_ITEMS = [
  "Votre compte et votre adresse e-mail",
  "Tous les articles de la garde-robe et les photos téléversées",
  "Toutes les tenues enregistrées et leurs dispositions sur le canevas",
  "Toutes les entrées du calendrier",
  "Les catégories et marques personnalisées que vous avez créées",
] as const;

type DeleteAccountSectionProps = {
  deletionAvailable: boolean;
};

export function DeleteAccountSection({ deletionAvailable }: DeleteAccountSectionProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const canSubmit =
    acknowledged &&
    confirmation.trim() === DELETE_CONFIRMATION &&
    password.trim().length > 0 &&
    !isPending;

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteUserAccount({ confirmation, password });

      if (!result.success) {
        setError(result.error);
      }
    });
  }

  return (
    <section className="space-y-4 border-t border-[var(--border-hairline)] pt-8">
      <div>
        <h2 className="text-title text-[var(--status-error)]">Supprimer mon compte</h2>
        <p className="text-caption mt-2 text-[var(--muted)]">
          Cela supprime définitivement votre compte et toutes les données associées. Cette action
          est irréversible (droit à l&apos;effacement, RGPD).
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-overline">Ce qui sera définitivement supprimé</p>
        <ul className="list-disc space-y-1.5 pl-5 text-caption text-[var(--muted)]">
          {DELETED_ITEMS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      {!deletionAvailable ? (
        <p role="status" className="alert-warning text-sm">
          La suppression de compte n&apos;est pas disponible dans cet environnement. Écrivez à{" "}
          <a
            href={`mailto:${legalConfig.contactEmail}`}
            className="text-[var(--foreground)] underline-offset-2 hover:underline"
          >
            {legalConfig.contactEmail}
          </a>{" "}
          pour demander l&apos;effacement de vos données.
        </p>
      ) : (
        <div className="space-y-4">
          <label className="flex cursor-pointer items-start gap-3 text-caption text-[var(--muted)]">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(event) => setAcknowledged(event.target.checked)}
              disabled={isPending}
              className="mt-0.5 shrink-0"
            />
            <span>Je comprends que cette action est définitive et irréversible</span>
          </label>

          <label className="block space-y-2">
            <span className="text-caption text-[var(--muted)]">
              Saisissez <strong className="text-[var(--foreground)]">{DELETE_CONFIRMATION}</strong> pour
              confirmer
            </span>
            <input
              type="text"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              disabled={isPending}
              autoComplete="off"
              className="input-field w-full"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-caption text-[var(--muted)]">Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isPending}
              autoComplete="current-password"
              className="input-field w-full"
            />
          </label>

          <button
            type="button"
            onClick={handleDelete}
            disabled={!canSubmit}
            className="btn-ghost text-sm text-[var(--status-error)] disabled:opacity-60"
          >
            {isPending ? "Suppression de votre compte…" : "Supprimer mon compte définitivement"}
          </button>
        </div>
      )}

      {error ? (
        <p role="alert" className="text-status-error text-sm">
          {error}
        </p>
      ) : null}
    </section>
  );
}
