"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { auditApi } from "@/lib/api/audit";
import type { AuditLog } from "@/types";
import { formatDate } from "@/utils/format";

const actions = [
  "",
  "CREATE",
  "UPDATE_PROGRAM",
  "DELETE_PROGRAM",
  "CREATE_SESSION",
  "UPDATE_SESSION",
  "DELETE_SESSION",
  "REORDER_SESSIONS",
  "IMPORT_SESSIONS",
];

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: "",
    from: "",
    to: "",
  });

  async function loadLogs(nextFilters = filters) {
    setIsLoading(true);

    try {
      const response = await auditApi.list({
        action: nextFilters.action || undefined,
        from: nextFilters.from || undefined,
        to: nextFilters.to || undefined,
      });

      setLogs(response.data);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isCancelled = false;

    async function initializeLogs() {
      try {
        const response = await auditApi.list();

        if (!isCancelled) {
          setLogs(response.data);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void initializeLogs();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Audit Log"
        title="Admin write history"
        description="Filter by action and date range to inspect creator activity across programs, sessions, imports, and ordering changes."
      />

      <Card>
        <div className="grid gap-4 md:grid-cols-4">
          <Select
            label="Action"
            value={filters.action}
            onChange={(event) =>
              setFilters((current) => ({ ...current, action: event.target.value }))
            }
          >
            <option value="">All actions</option>
            {actions
              .filter(Boolean)
              .map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
          </Select>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            <span className="font-medium">From</span>
            <input
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              type="date"
              value={filters.from}
              onChange={(event) =>
                setFilters((current) => ({ ...current, from: event.target.value }))
              }
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            <span className="font-medium">To</span>
            <input
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              type="date"
              value={filters.to}
              onChange={(event) =>
                setFilters((current) => ({ ...current, to: event.target.value }))
              }
            />
          </label>

          <div className="flex items-end">
            <button
              className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              onClick={() => void loadLogs()}
              type="button"
            >
              Apply filters
            </button>
          </div>
        </div>
      </Card>

      <Card>
        {isLoading ? (
          <Spinner label="Loading audit history..." />
        ) : logs.length ? (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
                      {log.action}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">
                      {log.entityType} • {log.entityId}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      Actor {log.actorId}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500">
                    {formatDate(log.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No audit events found"
            description="Try widening the date window or clearing the action filter."
          />
        )}
      </Card>
    </div>
  );
}
