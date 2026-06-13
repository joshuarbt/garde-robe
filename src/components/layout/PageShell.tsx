import { FadeIn } from "@/components/layout/motion";

type PageShellProps = {
  title: string;
  description: string;
  eyebrow?: string;
  children?: React.ReactNode;
  wide?: boolean;
  actions?: React.ReactNode;
};

export function PageShell({
  title,
  description,
  eyebrow,
  children,
  wide = false,
  actions,
}: PageShellProps) {
  return (
    <FadeIn
      className={`mx-auto w-full px-4 py-12 sm:px-6 sm:py-14 ${wide ? "max-w-5xl" : "max-w-2xl"}`}
    >
      {eyebrow ? <p className="label-caps mb-3">{eyebrow}</p> : null}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-normal tracking-tight text-[var(--foreground)] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-xl text-[var(--muted)]">{description}</p>
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      {children ? <div className="mt-10">{children}</div> : null}
    </FadeIn>
  );
}
