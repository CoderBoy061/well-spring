import { apiClient } from "@/lib/api/client";

export const uploadsApi = {
  async upload(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient.post<{ url: string }>("/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
