import axios from "axios";

import { useAuthStore } from "@/shared/lib/auth-store";
import { env } from "@/shared/lib/env";

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    if (!originalRequest || (originalRequest as { _retry?: boolean })._retry) {
      if (typeof window !== "undefined") {
        useAuthStore.getState().clearTokens();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    const { refreshToken } = useAuthStore.getState();
    if (!refreshToken) {
      if (typeof window !== "undefined") {
        useAuthStore.getState().clearTokens();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    (originalRequest as { _retry?: boolean })._retry = true;

    try {
      const res = await axios.post(
        `${env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
        { refreshToken },
      );
      const { accessToken: newAccess, refreshToken: newRefresh } = res.data;
      useAuthStore.getState().setTokens(newAccess, newRefresh);
      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      return apiClient(originalRequest);
    } catch {
      if (typeof window !== "undefined") {
        useAuthStore.getState().clearTokens();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  },
);
