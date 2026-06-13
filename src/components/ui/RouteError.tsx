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
    <div className="rounded-lg border border-red-200 bg-red-50 p-6">
      <p className="font-medium text-red-900">{title}</p>
      <p className="mt-2 text-sm text-red-800">{message}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
        >
          Try again
        </button>
        <Link
          href={backHref}
          className="rounded-md border border-stone-300 px-3 py-1.5 text-sm text-stone-800 hover:bg-stone-50"
        >
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
