"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Spinner } from "@/components/ui/spinner";

export function GuestOnly({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuth();

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isReady, router]);

  if (!isReady) {
    return <Spinner label="Checking your session..." />;
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
