"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusMessage } from "@/components/ui/status-message";
import { uploadsApi } from "@/lib/api/uploads";
import { extractErrorMessage } from "@/utils/http";

type SessionFormValues = {
  title: string;
  duration: number;
  instructorName: string;
  mediaUrl: string;
  tags: string;
};

type SessionFormProps = {
  initialValues?: SessionFormValues;
  submitLabel: string;
  onSubmit: (payload: {
    title: string;
    duration: number;
    instructorName: string;
    mediaUrl?: string;
    tags: string[];
  }) => Promise<void>;
};

export function SessionForm({
  initialValues,
  submitLabel,
  onSubmit,
}: SessionFormProps) {
  const [form, setForm] = useState<SessionFormValues>(
    initialValues ?? {
      title: "",
      duration: 10,
      instructorName: "",
      mediaUrl: "",
      tags: "",
    },
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError(null);
    setSuccess(null);
    setIsUploading(true);

    try {
      const response = await uploadsApi.upload(file);
      setForm((current) => ({ ...current, mediaUrl: response.data.url }));
      setSuccess("Media uploaded and attached.");
    } catch (uploadError) {
      setError(extractErrorMessage(uploadError));
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        title: form.title,
        duration: Number(form.duration),
        instructorName: form.instructorName,
        mediaUrl: form.mediaUrl || undefined,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });
      setSuccess("Session saved successfully.");
    } catch (submissionError) {
      setError(extractErrorMessage(submissionError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <Input
        label="Session title"
        placeholder="Deep Sleep Wind-Down"
        value={form.title}
        onChange={(event) =>
          setForm((current) => ({ ...current, title: event.target.value }))
        }
        required
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Duration (minutes)"
          type="number"
          min={1}
          value={form.duration}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              duration: Number(event.target.value),
            }))
          }
          required
        />
        <Input
          label="Instructor"
          placeholder="Ariana Wells"
          value={form.instructorName}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              instructorName: event.target.value,
            }))
          }
          required
        />
      </div>

      <Input
        label="Tags"
        placeholder="sleep, recovery, evening"
        value={form.tags}
        onChange={(event) =>
          setForm((current) => ({ ...current, tags: event.target.value }))
        }
      />

      <Input
        label="Media URL"
        placeholder="/uploads/audio-track.mp3"
        value={form.mediaUrl}
        onChange={(event) =>
          setForm((current) => ({ ...current, mediaUrl: event.target.value }))
        }
      />

      <label className="flex flex-col gap-3 text-sm text-slate-700">
        <span className="font-medium">Upload media</span>
        <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Drop in audio or video for this session
              </p>
              <p className="mt-1 text-xs text-slate-500">
                The media URL field will be filled automatically after upload.
              </p>
            </div>
            <div className="relative inline-flex overflow-hidden rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/10">
              <span className="pointer-events-none px-4 py-2 text-sm font-semibold">
                Choose file
              </span>
              <input
                className="absolute inset-0 cursor-pointer opacity-0"
                type="file"
                accept="audio/*,video/*"
                onChange={handleUpload}
              />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            {isUploading ? "Uploading selected media..." : "No media selected yet."}
          </div>
        </div>
      </label>

      <StatusMessage tone="error" message={error} />
      <StatusMessage tone="success" message={success} />

      <div className="flex flex-wrap items-center gap-3">
        <Button
          className="min-w-40"
          disabled={isSubmitting || isUploading}
          type="submit"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
        {isUploading ? (
          <span className="self-center text-sm text-slate-500">
            Uploading media...
          </span>
        ) : null}
      </div>
    </form>
  );
}
