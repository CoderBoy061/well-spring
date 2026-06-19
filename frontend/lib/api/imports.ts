import { apiClient } from "@/lib/api/client";
import type { ImportResult } from "@/types";

export const importsApi = {
  async importSessions(programId: string, clientImportId: string, file: File) {
    const formData = new FormData();
    formData.append("clientImportId", clientImportId);
    formData.append("file", file);

    return apiClient.post<ImportResult>(
      `/programs/${programId}/import`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },
};
