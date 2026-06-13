type PageShellProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-medium tracking-tight text-stone-900">{title}</h1>
      <p className="mt-2 text-stone-600">{description}</p>
      {children ? <div className="mt-8">{children}</div> : null}
    </div>
  );
}
