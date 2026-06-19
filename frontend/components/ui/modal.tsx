"use client";

import { useEffect } from "react";

export function Modal({
  title,
  description,
  onClose,
  children,
}: {
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm">
      <button
        aria-label="Close modal"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />
      <div className="relative z-10 max-h-[88vh] w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/60 bg-white shadow-[0_30px_120px_rgba(15,23,42,0.2)]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
              Workspace modal
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">{title}</h3>
            {description ? (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                {description}
              </p>
            ) : null}
          </div>
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>
        <div className="max-h-[calc(88vh-132px)] overflow-y-auto px-6 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
