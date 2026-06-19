import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export function Textarea({
  label,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-slate-700">
      {label ? <span className="font-medium">{label}</span> : null}
      <textarea
        className={`min-h-28 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 ${className}`}
        {...props}
      />
    </label>
  );
}
