"use client";

import { useState } from "react";

const EXPORT_CONTENTS = [
  "Votre adresse e-mail et les paramètres du compte",
  "Tous les articles de la garde-robe avec leurs métadonnées",
  "Toutes les tenues enregistrées et leurs dispositions sur le canevas",
  "Entrées du calendrier",
  "Vos photos téléversées",
  "data.json lisible plus des résumés CSV",
] as const;

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function parseFilename(contentDisposition: string | null): string {
  if (!contentDisposition) {
    return "garde-robe-export.zip";
  }

  const match = contentDisposition.match(/filename="([^"]+)"/);
  return match?.[1] ?? "garde-robe-export.zip";
}

export function ExportDataSection() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleExport() {
    setError(null);
    setIsPending(true);

    try {
      const response = await fetch("/api/privacy/export");

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "L'exportation a échoué.");
      }

      const blob = await response.blob();
      const filename = parseFilename(response.headers.get("Content-Disposition"));
      downloadBlob(blob, filename);
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : "L'exportation a échoué.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <section className="space-y-4 border-t border-[var(--border-hairline)] pt-8">
      <div>
        <h2 className="text-title">Télécharger mes données</h2>
        <p className="text-caption mt-2 text-[var(--muted)]">
          Téléchargez une copie de vos données personnelles dans un format lisible (droit d&apos;accès et
          à la portabilité des données, RGPD).
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-overline">Votre export comprend</p>
        <ul className="list-disc space-y-1.5 pl-5 text-caption text-[var(--muted)]">
          {EXPORT_CONTENTS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={handleExport}
        disabled={isPending}
        className="btn-secondary disabled:opacity-60"
      >
        {isPending ? "Préparation de votre export…" : "Télécharger mes données"}
      </button>

      {error ? (
        <p role="alert" className="text-status-error text-sm">
          {error}
        </p>
      ) : null}
    </section>
  );
}
