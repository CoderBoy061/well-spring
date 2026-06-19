export function Spinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 text-slate-500">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
