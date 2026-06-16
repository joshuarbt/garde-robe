"use client";

import Link from "next/link";

type RouteErrorProps = {
  title: string;
  message: string;
  backHref: string;
  backLabel: string;
  reset: () => void;
};

export function RouteError({
  title,
  message,
  backHref,
  backLabel,
  reset,
}: RouteErrorProps) {
  return (
    <div className="alert-error p-6">
      <p className="text-heading text-[var(--status-error)]">{title}</p>
      <p className="mt-2">{message}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="btn-primary btn-sm text-sm">
          Réessayer
        </button>
        <Link href={backHref} className="btn-secondary btn-sm text-sm">
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
