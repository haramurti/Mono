import type { User } from "@/shared/types/mono";

export type CurrentUserDto = User;

export type GoogleOAuthCallbackRequestDto = {
  idToken: string;
};

export type AuthResponseDto = {
  user: User;
  accessToken?: string | null;
};
