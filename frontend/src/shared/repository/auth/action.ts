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
