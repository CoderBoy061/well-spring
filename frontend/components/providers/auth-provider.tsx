"use client";

import {
  startTransition,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authApi } from "@/lib/api/auth";
import type { Creator } from "@/types";
import { storage } from "@/utils/storage";

type AuthContextValue = {
  creator: Creator | null;
  token: string | null;
  isAuthenticated: boolean;
  isReady: boolean;
  setSession: (token: string, creator: Creator) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function restoreSession() {
      const storedToken = storage.getToken();
      const storedCreator = storage.getCreator();

      if (!storedToken) {
        if (!isCancelled) {
          setIsReady(true);
        }
        return;
      }

      if (!isCancelled) {
        startTransition(() => {
          setToken(storedToken);
          setCreator(storedCreator);
        });
      }
    }

    void restoreSession();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    let isCancelled = false;

    authApi
      .me()
      .then((response) => {
        if (isCancelled) {
          return;
        }

        setCreator((currentCreator) => {
          const nextCreator = {
            ...currentCreator,
            creatorId: response.data.creatorId,
          };
          storage.setCreator(nextCreator);
          return nextCreator;
        });
      })
      .catch(() => {
        if (isCancelled) {
          return;
        }

        storage.clearSession();
        setToken(null);
        setCreator(null);
      })
      .finally(() => {
        if (!isCancelled) {
          setIsReady(true);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [token]);

  const setSession = useCallback((nextToken: string, nextCreator: Creator) => {
    storage.setToken(nextToken);
    storage.setCreator(nextCreator);
    setToken(nextToken);
    setCreator(nextCreator);
    setIsReady(true);
  }, []);

  const logout = useCallback(() => {
    storage.clearSession();
    setToken(null);
    setCreator(null);
    setIsReady(true);
  }, []);

  const value = useMemo(
    () => ({
      creator,
      token,
      isAuthenticated: Boolean(token),
      isReady,
      setSession,
      logout,
    }),
    [creator, isReady, logout, setSession, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
