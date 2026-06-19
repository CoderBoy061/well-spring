import { apiClient } from "@/lib/api/client";
import type { AuditLog } from "@/types";

export const auditApi = {
  list(query?: { action?: string; from?: string; to?: string }) {
    return apiClient.get<AuditLog[]>("/audit-logs", {
      params: query,
    });
  },
};
