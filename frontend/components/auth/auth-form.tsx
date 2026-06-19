"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusMessage } from "@/components/ui/status-message";
import { authApi } from "@/lib/api/auth";
import { extractErrorMessage } from "@/utils/http";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { setSession } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const isSignup = mode === "signup";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = isSignup
        ? await authApi.signup(form)
        : await authApi.login({
            email: form.email,
            password: form.password,
          });

      setSession(response.data.token, response.data.creator);
      router.replace("/dashboard");
    } catch (submissionError) {
      setError(extractErrorMessage(submissionError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef6f1_100%)] px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl">
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">
            Breakthrough Assessment
          </p>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight">
            Build and manage wellness programs with a calm, focused admin flow.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
            This admin console gives creators a single branded workspace for
            programs, session uploads, CSV imports, and tenant-safe audit
            visibility.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              "Program CRUD",
              "Media upload flow",
              "CSV import feedback",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-sm text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <Card className="self-center p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">
            {isSignup ? "Creator Signup" : "Creator Login"}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            {isSignup ? "Create your admin account" : "Welcome back"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {isSignup
              ? "Create a creator workspace and start organizing your wellness content."
              : "Sign in to manage programs, sessions, uploads, and audit events."}
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {isSignup ? (
              <Input
                label="Creator name"
                placeholder="Moonlight Wellness"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                required
              />
            ) : null}

            <Input
              label="Email"
              type="email"
              placeholder="creator@example.com"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              required
            />

            <StatusMessage tone="error" message={error} />

            <Button className="w-full py-3" disabled={isSubmitting} type="submit">
              {isSubmitting
                ? "Please wait..."
                : isSignup
                  ? "Create workspace"
                  : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            {isSignup ? "Already have an account?" : "Need a new creator account?"}{" "}
            <Link
              className="font-semibold text-emerald-700 hover:text-emerald-600"
              href={isSignup ? "/login" : "/signup"}
            >
              {isSignup ? "Log in" : "Sign up"}
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
