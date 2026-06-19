import { apiClient } from "@/lib/api/client";
import type { AuthResponse } from "@/types";

export const authApi = {
  signup(payload: { name: string; email: string; password: string }) {
    return apiClient.post<AuthResponse>("/auth/signup", payload);
  },

  login(payload: { email: string; password: string }) {
    return apiClient.post<AuthResponse>("/auth/login", payload);
  },

  me() {
    return apiClient.get<{ creatorId: string }>("/auth/me");
  },
};
