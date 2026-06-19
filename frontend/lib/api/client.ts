"use client";

import axios from "axios";
import { storage } from "@/utils/storage";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = storage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.clearSession();
    }

    return Promise.reject(error);
  },
);
