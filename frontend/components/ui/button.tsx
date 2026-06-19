import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-400",
  secondary:
    "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
  danger: "bg-rose-500 text-white hover:bg-rose-400",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
