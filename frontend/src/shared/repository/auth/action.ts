import { apiClient } from "@/shared/lib/axios";

import type { AuthResponseDto, CurrentUserDto } from "./dto";

export async function getCurrentUser() {
  const response = await apiClient.get<CurrentUserDto>("/me");
  return response.data;
}

export async function loginWithCredentials(payload: {
  email: string;
  password: string;
}) {
  const response = await apiClient.post<AuthResponseDto>(
    "/auth/login",
    payload,
  );
  return response.data;
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await apiClient.post<AuthResponseDto>(
    "/auth/register",
    payload,
  );
  return response.data;
}

// Demo-only: clears the demo session cookie on the server side.
export async function logout() {
  const response = await apiClient.post<{ success: true }>("/logout");
  return response.data;
}
