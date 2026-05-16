import { apiClient } from "@/shared/lib/axios";

import type {
  AuthResponseDto,
  CurrentUserDto,
  GoogleOAuthCallbackRequestDto,
} from "./dto";

export async function getCurrentUser() {
  const response = await apiClient.get<CurrentUserDto>("/me");
  return response.data;
}

export async function googleOAuthCallback(
  payload: GoogleOAuthCallbackRequestDto,
) {
  const response = await apiClient.post<AuthResponseDto>(
    "/auth/google/callback",
    payload,
  );
  return response.data;
}

// Demo-only auxiliary call. NOT part of the OpenAPI contract.
// Pairs with /api/logout to clear the demo session cookie. Replace with a
// pure client-side token-discard once a real bearer auth backend is in place.
export async function logout() {
  const response = await apiClient.post<{ success: true }>("/logout");
  return response.data;
}
