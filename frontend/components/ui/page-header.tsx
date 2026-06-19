export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>
      {actions}
    </div>
  );
}
