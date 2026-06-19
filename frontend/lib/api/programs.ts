import { apiClient } from "@/lib/api/client";
import type { Program } from "@/types";

export const programsApi = {
  list() {
    return apiClient.get<Program[]>("/programs");
  },

  getById(id: string) {
    return apiClient.get<Program>(`/programs/${id}`);
  },

  create(payload: { title: string; description?: string }) {
    return apiClient.post<Program>("/programs", payload);
  },

  update(id: string, payload: { title?: string; description?: string }) {
    return apiClient.put<Program>(`/programs/${id}`, payload);
  },

  remove(id: string) {
    return apiClient.delete<{ success: boolean }>(`/programs/${id}`);
  },
};
