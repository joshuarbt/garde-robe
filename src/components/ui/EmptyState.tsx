import Link from "next/link";

type EmptyStateProps = {
  message: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
};

export function EmptyState({
  message,
  description,
  actionLabel,
  actionHref,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-sm border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-8 py-12 text-center ${className}`.trim()}
    >
      <p className="text-[var(--muted)]">{message}</p>
      {description ? (
        <p className="mt-2 text-sm text-stone-500">{description}</p>
      ) : null}
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="btn-ghost mt-5 inline-block">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
