"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProgramForm } from "@/components/programs/program-form";
import { CsvImportPanel } from "@/components/sessions/csv-import-panel";
import { SessionForm } from "@/components/sessions/session-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { Spinner } from "@/components/ui/spinner";
import { StatusMessage } from "@/components/ui/status-message";
import { programsApi } from "@/lib/api/programs";
import { sessionsApi } from "@/lib/api/sessions";
import type { Program, Session } from "@/types";
import { formatDuration } from "@/utils/format";
import { extractErrorMessage } from "@/utils/http";

export function ProgramDetailScreen({ programId }: { programId: string }) {
  const router = useRouter();
  const [program, setProgram] = useState<Program | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [isCreateSessionModalOpen, setIsCreateSessionModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setIsLoading(true);
    setError(null);

    try {
      const [programResponse, sessionResponse] = await Promise.all([
        programsApi.getById(programId),
        sessionsApi.list(programId),
      ]);

      setProgram(programResponse.data);
      setSessions(sessionResponse.data);
    } catch (loadError) {
      setError(extractErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isCancelled = false;

    async function initializeData() {
      try {
        const [programResponse, sessionResponse] = await Promise.all([
          programsApi.getById(programId),
          sessionsApi.list(programId),
        ]);

        if (!isCancelled) {
          setProgram(programResponse.data);
          setSessions(sessionResponse.data);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(extractErrorMessage(loadError));
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void initializeData();

    return () => {
      isCancelled = true;
    };
  }, [programId]);

  async function moveSession(sessionId: string, direction: "up" | "down") {
    const currentIndex = sessions.findIndex((session) => session.id === sessionId);

    if (currentIndex === -1) {
      return;
    }

    const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (nextIndex < 0 || nextIndex >= sessions.length) {
      return;
    }

    const nextSessions = [...sessions];
    const [current] = nextSessions.splice(currentIndex, 1);
    nextSessions.splice(nextIndex, 0, current);

    setSessions(nextSessions);
    await sessionsApi.reorder(
      programId,
      nextSessions.map((session) => session.id),
    );
  }

  if (isLoading) {
    return <Spinner label="Loading program workspace..." />;
  }

  if (!program) {
    return (
      <Card>
        <StatusMessage tone="error" message={error ?? "Program not found."} />
        <Link
          className="mt-4 inline-block text-sm font-medium text-emerald-700"
          href="/dashboard"
        >
          Back to programs
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Program Workspace"
        title={program.title}
        description="Edit the program promise, shape the ordered lesson flow, and keep uploads plus imports feeling deliberate instead of bolted on."
        actions={
          <Link
            href="/dashboard"
            className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
          >
            Back to programs
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-900 bg-gradient-to-br from-slate-950 to-slate-900 text-white shadow-[0_24px_80px_rgba(2,6,23,0.28)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
            Program
          </p>
          <h2 className="mt-4 text-2xl font-semibold">{program.title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {program.description ||
              "Add a stronger positioning summary so the program feels more intentional from the first glance."}
          </p>
        </Card>

        <Card className="border-emerald-100 bg-gradient-to-br from-white to-emerald-50/70">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
            Sessions
          </p>
          <h2 className="mt-4 text-4xl font-semibold text-slate-950">
            {sessions.length}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Lesson blocks currently attached to this creator experience.
          </p>
        </Card>

        <Card className="border-sky-100 bg-gradient-to-br from-white to-sky-50/70">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
            Sequence
          </p>
          <h2 className="mt-4 text-4xl font-semibold text-slate-950">
            {sessions.length ? sessions[sessions.length - 1].position : 0}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Current end-of-flow position after any reordering changes.
          </p>
        </Card>
      </div>

      <div className="grid gap-6 2xl:grid-cols-[0.78fr_1.22fr]">
        <div className="space-y-6">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400" />
            <h2 className="text-2xl font-semibold text-slate-950">
              Program details
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Refine the promise, pacing, and overall creator positioning before
              expanding the session library.
            </p>
            <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
              <p className="text-sm font-semibold text-slate-900">
                {program.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {program.description || "No description added yet."}
              </p>
              <Button
                className="mt-5 min-w-40"
                onClick={() => setIsProgramModalOpen(true)}
              >
                Edit program
              </Button>
            </div>

            <div className="mt-8 rounded-2xl border border-rose-100 bg-rose-50/70 p-4">
              <p className="text-sm font-semibold text-rose-700">Danger zone</p>
              <p className="mt-1 text-sm leading-6 text-rose-600">
                Deleting this program removes the current workspace and its
                attached sessions.
              </p>
              <Button
                className="mt-4"
                variant="danger"
                onClick={async () => {
                  await programsApi.remove(program.id);
                  router.replace("/dashboard");
                }}
              >
                Delete program
              </Button>
            </div>
          </Card>

          <CsvImportPanel programId={program.id} onComplete={loadData} />
        </div>

        <div className="space-y-6">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400" />
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">
                  Add session
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Add lesson metadata, attach media, and keep the sequence ready
                  for reordering without making the form feel heavy.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-950 px-4 py-3 text-sm text-white">
                New sessions append to the end automatically
              </div>
            </div>
            <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
              <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <div className="rounded-2xl bg-white px-4 py-3">
                  Add media, tags, and instructor metadata
                </div>
                <div className="rounded-2xl bg-white px-4 py-3">
                  Sessions can be reordered after creation
                </div>
              </div>
              <Button
                className="mt-5 min-w-40"
                onClick={() => setIsCreateSessionModalOpen(true)}
              >
                New session
              </Button>
            </div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500" />
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">
                  Session runway
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Keep the flow intentional by reordering, editing, or removing
                  sessions from the current lineup.
                </p>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
                {sessions.length} total session{sessions.length === 1 ? "" : "s"}
              </div>
            </div>

            <div className="mt-6 max-h-[720px] space-y-4 overflow-y-auto pr-2">
              {sessions.length ? (
                sessions.map((session, index) => (
                  <div
                    key={session.id}
                    className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
                  >
                    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                            Session {session.position}
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                            {formatDuration(session.duration)}
                          </span>
                        </div>
                        <h3 className="mt-4 max-w-xl text-2xl font-semibold leading-tight text-slate-950">
                          {session.title}
                        </h3>
                        <p className="mt-2 text-sm font-medium text-slate-600">
                          Led by {session.instructorName}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {session.tags.length ? (
                            session.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
                              >
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400">No tags yet</span>
                          )}
                        </div>
                        {session.mediaUrl ? (
                          <a
                            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-600"
                            href={session.mediaUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View uploaded media
                          </a>
                        ) : null}
                      </div>

                      <div className="flex flex-col gap-2 lg:w-[170px]">
                        <Button
                          className="w-full"
                          variant="secondary"
                          onClick={() => void moveSession(session.id, "up")}
                          disabled={index === 0}
                        >
                          Move up
                        </Button>
                        <Button
                          className="w-full"
                          variant="secondary"
                          onClick={() => void moveSession(session.id, "down")}
                          disabled={index === sessions.length - 1}
                        >
                          Move down
                        </Button>
                        <Button
                          className="w-full"
                          variant="ghost"
                          onClick={() =>
                            setEditingSessionId((current) =>
                              current === session.id ? null : session.id,
                            )
                          }
                        >
                          {editingSessionId === session.id ? "Close editor" : "Edit"}
                        </Button>
                        <Button
                          className="w-full"
                          variant="danger"
                          onClick={async () => {
                            await sessionsApi.remove(session.id);
                            await loadData();
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>

                    {editingSessionId === session.id ? (
                      <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                        Editing opens in a modal below so the session list stays
                        compact.
                      </div>
                    ) : null}
                  </div>
                ))
              ) : (
                <EmptyState
                  title="No sessions yet"
                  description="Add the first session to start structuring this creator program."
                />
              )}
            </div>
          </Card>
        </div>
      </div>

      {isProgramModalOpen ? (
        <Modal
          title="Edit program"
          description="Update the program headline and top-level description without stretching the page layout."
          onClose={() => setIsProgramModalOpen(false)}
        >
          <ProgramForm
            title={program.title}
            description={program.description ?? ""}
            submitLabel="Update program"
            onSubmit={async (payload) => {
              const response = await programsApi.update(program.id, payload);
              setProgram(response.data);
              setIsProgramModalOpen(false);
            }}
          />
        </Modal>
      ) : null}

      {isCreateSessionModalOpen ? (
        <Modal
          title="Create session"
          description="Add a new lesson with duration, instructor details, tags, and media in one focused flow."
          onClose={() => setIsCreateSessionModalOpen(false)}
        >
          <SessionForm
            submitLabel="Create session"
            onSubmit={async (payload) => {
              await sessionsApi.create(program.id, payload);
              await loadData();
              setIsCreateSessionModalOpen(false);
            }}
          />
        </Modal>
      ) : null}

      {editingSessionId ? (
        <Modal
          title="Edit session"
          description="Adjust metadata or media without losing your place in the session list."
          onClose={() => setEditingSessionId(null)}
        >
          <SessionForm
            initialValues={{
              title:
                sessions.find((session) => session.id === editingSessionId)?.title ??
                "",
              duration:
                sessions.find((session) => session.id === editingSessionId)
                  ?.duration ?? 10,
              instructorName:
                sessions.find((session) => session.id === editingSessionId)
                  ?.instructorName ?? "",
              mediaUrl:
                sessions.find((session) => session.id === editingSessionId)
                  ?.mediaUrl ?? "",
              tags:
                sessions
                  .find((session) => session.id === editingSessionId)
                  ?.tags.join(", ") ?? "",
            }}
            submitLabel="Update session"
            onSubmit={async (payload) => {
              await sessionsApi.update(editingSessionId, payload);
              await loadData();
              setEditingSessionId(null);
            }}
          />
        </Modal>
      ) : null}
    </div>
  );
}
