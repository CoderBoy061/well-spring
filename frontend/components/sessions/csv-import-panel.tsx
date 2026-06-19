"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusMessage } from "@/components/ui/status-message";
import { importsApi } from "@/lib/api/imports";
import type { ImportResult } from "@/types";
import { extractErrorMessage } from "@/utils/http";

export function CsvImportPanel({
  programId,
  onComplete,
}: {
  programId: string;
  onComplete: () => Promise<void>;
}) {
  const [clientImportId, setClientImportId] = useState(
    () => `import-${Date.now().toString(36)}`,
  );
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError("Please choose a CSV file.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await importsApi.importSessions(
        programId,
        clientImportId,
        file,
      );
      setResult(response.data);
      await onComplete();
    } catch (submissionError) {
      setError(extractErrorMessage(submissionError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <h3 className="text-xl font-semibold text-slate-950">Bulk CSV import</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Use a stable client import ID to retry the same import safely without
        creating duplicate rows.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-sm text-slate-700">
          <span className="font-medium">Client import ID</span>
          <input
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            value={clientImportId}
            onChange={(event) => setClientImportId(event.target.value)}
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-700">
          <span className="font-medium">CSV file</span>
          <input
            className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3"
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </label>

        <StatusMessage tone="error" message={error} />

        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Importing..." : "Run import"}
        </Button>
      </form>

      {result ? (
        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-800">
            {result.message ?? `${result.successCount ?? 0} sessions imported.`}
          </p>
          {result.failedRows?.length ? (
            <div className="mt-3 space-y-2">
              {result.failedRows.map((row) => (
                <div
                  key={`${row.row}-${row.reason}`}
                  className="rounded-xl bg-white px-3 py-2 text-sm text-rose-600"
                >
                  Row {row.row}: {row.reason}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
