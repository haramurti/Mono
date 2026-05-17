import type { User } from "@/shared/types/mono";

export type CurrentUserDto = User;

export type RegisterRequestDto = {
  name: string;
  email: string;
  password: string;
};

export type LoginRequestDto = {
  email: string;
  password: string;
};

export type GoogleOAuthCallbackRequestDto = {
  idToken: string;
};

export type AuthResponseDto = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type RefreshTokenRequestDto = {
  refreshToken: string;
};

export type RefreshTokenResponseDto = {
  accessToken: string;
  refreshToken: string;
};
