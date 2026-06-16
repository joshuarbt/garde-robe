import { FadeIn } from "@/components/layout/motion";

type PageShellProps = {
  title: string;
  subtitle?: string;
  description?: string;
  eyebrow?: string;
  children?: React.ReactNode;
  wide?: boolean;
  compact?: boolean;
  actions?: React.ReactNode;
  actionsAlign?: "start" | "baseline";
};

export function PageShell({
  title,
  subtitle,
  description,
  eyebrow,
  children,
  wide = false,
  compact = true,
  actions,
  actionsAlign = "start",
}: PageShellProps) {
  return (
    <FadeIn
      className={`mx-auto min-w-0 w-full px-[var(--space-page-x)] py-[var(--space-page-y)] ${
        wide ? "max-w-5xl" : "max-w-2xl"
      }`}
    >
      {eyebrow ? <p className="text-overline mb-2">{eyebrow}</p> : null}
      <div
        className={`flex flex-col gap-4 md:flex-row md:justify-between md:gap-4 ${
          actionsAlign === "baseline" ? "md:items-baseline" : "md:items-start"
        }`}
      >
        <div className="min-w-0 flex-1">
          <h1 className={`break-words ${compact ? "text-display" : "text-display-lg"}`}>
            {title}
          </h1>
          {subtitle ? <p className="text-caption mt-3 break-words">{subtitle}</p> : null}
          {description && !compact ? (
            <p className="text-caption mt-4 max-w-xl break-words">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex min-w-0 w-full flex-wrap items-center gap-2 md:w-auto md:shrink-0 md:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
      {children ? (
        <div className="mt-10 min-w-0 md:mt-12">{children}</div>
      ) : null}
    </FadeIn>
  );
}
