"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusMessage } from "@/components/ui/status-message";
import { Textarea } from "@/components/ui/textarea";
import { extractErrorMessage } from "@/utils/http";

type ProgramFormProps = {
  title?: string;
  description?: string;
  submitLabel: string;
  onSubmit: (payload: { title: string; description: string }) => Promise<void>;
};

export function ProgramForm({
  title = "",
  description = "",
  submitLabel,
  onSubmit,
}: ProgramFormProps) {
  const [form, setForm] = useState({ title, description });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      await onSubmit(form);
      setSuccess("Saved successfully.");
    } catch (submissionError) {
      setError(extractErrorMessage(submissionError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <Input
        label="Program title"
        placeholder="30-Day Sleep Reset"
        value={form.title}
        onChange={(event) =>
          setForm((current) => ({ ...current, title: event.target.value }))
        }
        required
      />
      <Textarea
        label="Description"
        placeholder="Outline the journey, structure, and who this program is for."
        value={form.description}
        onChange={(event) =>
          setForm((current) => ({
            ...current,
            description: event.target.value,
          }))
        }
      />
      <StatusMessage tone="error" message={error} />
      <StatusMessage tone="success" message={success} />
      <Button className="min-w-40" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
