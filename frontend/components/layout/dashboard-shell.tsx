"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/components/providers/auth-provider";

const links = [
  { href: "/dashboard", label: "Programs" },
  { href: "/audit-logs", label: "Audit Log" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { creator, isAuthenticated, isReady, logout } = useAuth();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isReady, router]);

  if (!isReady) {
    return <Spinner label="Restoring your admin session..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef6f1_100%)]">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-6 lg:px-6">
        <aside className="hidden w-72 shrink-0 rounded-[2rem] border border-white/60 bg-slate-950 p-6 text-white shadow-2xl lg:flex lg:flex-col">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">
              Wellspring
            </p>
            <h2 className="mt-4 text-2xl font-semibold">Creator Admin</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Manage programs, sessions, uploads, imports, and audit history in
              one place.
            </p>
          </div>

          <nav className="mt-10 flex flex-col gap-2">
            {links.map((link) => {
              const active = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold no-underline transition ${
                    active
                      ? "bg-white !text-slate-950 shadow-sm"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      active ? "bg-emerald-500" : "bg-slate-600"
                    }`}
                  />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-3xl bg-white/10 p-4">
            <p className="text-sm font-medium text-white">
              {creator?.name ?? "Logged-in creator"}
            </p>
            <p className="mt-1 text-xs text-slate-300">{creator?.email}</p>
            <Button
              className="mt-4 w-full"
              variant="secondary"
              onClick={() => {
                logout();
                router.replace("/login");
              }}
            >
              Sign out
            </Button>
          </div>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
