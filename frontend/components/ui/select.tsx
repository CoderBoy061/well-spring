import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export function Select({ label, className = "", ...props }: SelectProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-slate-700">
      {label ? <span className="font-medium">{label}</span> : null}
      <select
        className={`rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 ${className}`}
        {...props}
      />
    </label>
  );
}
