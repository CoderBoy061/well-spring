"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProgramForm } from "@/components/programs/program-form";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Spinner } from "@/components/ui/spinner";
import { programsApi } from "@/lib/api/programs";
import type { Program } from "@/types";
import { formatDate } from "@/utils/format";

export function ProgramsDashboard() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadPrograms() {
    setIsLoading(true);

    try {
      const response = await programsApi.list();
      setPrograms(response.data);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isCancelled = false;

    async function initializePrograms() {
      try {
        const response = await programsApi.list();

        if (!isCancelled) {
          setPrograms(response.data);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void initializePrograms();

    return () => {
      isCancelled = true;
    };
  }, []);

  if (isLoading) {
    return <Spinner label="Loading your programs..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Programs"
        title="Creator program control center"
        description="Create wellness programs, track their most recent edits, and jump straight into session-level management."
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <h2 className="text-xl font-semibold text-slate-950">All programs</h2>
          <p className="mt-2 text-sm text-slate-500">
            Open a program to edit details, manage sessions, upload media, or run
            imports.
          </p>

          <div className="mt-6 grid gap-4">
            {programs.length ? (
              programs.map((program) => (
                <Link
                  key={program.id}
                  href={`/programs/${program.id}`}
                  className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 transition hover:border-emerald-200 hover:bg-emerald-50/60"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {program.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {program.description || "No description yet."}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500">
                      Updated {formatDate(program.updatedAt)}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <EmptyState
                title="No programs yet"
                description="Create your first program to start organizing session content."
              />
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-slate-950">Create program</h2>
          <p className="mt-2 text-sm text-slate-500">
            Keep it lightweight. You can always refine the description inside the
            program workspace later.
          </p>
          <div className="mt-6">
            <ProgramForm
              submitLabel="Create program"
              onSubmit={async (payload) => {
                await programsApi.create(payload);
                await loadPrograms();
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
