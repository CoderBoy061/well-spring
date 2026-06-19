import { apiClient } from "@/lib/api/client";
import type { Session } from "@/types";

export const sessionsApi = {
  list(programId: string) {
    return apiClient.get<Session[]>(`/programs/${programId}/sessions`);
  },

  create(
    programId: string,
    payload: {
      title: string;
      duration: number;
      instructorName: string;
      mediaUrl?: string;
      tags?: string[];
    },
  ) {
    return apiClient.post<Session>(`/programs/${programId}/sessions`, payload);
  },

  update(
    id: string,
    payload: Partial<{
      title: string;
      duration: number;
      instructorName: string;
      mediaUrl: string;
      tags: string[];
    }>,
  ) {
    return apiClient.put<Session>(`/sessions/${id}`, payload);
  },

  remove(id: string) {
    return apiClient.delete<{ success: true }>(`/sessions/${id}`);
  },

  reorder(programId: string, sessionIds: string[]) {
    return apiClient.patch<{ success: true }>(`/programs/${programId}/reorder`, {
      sessionIds,
    });
  },
};
