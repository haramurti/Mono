import { NextResponse } from "next/server";

import {
  createDemoSessionCookie,
  generateDemoTokens,
} from "@/shared/lib/auth";
import { getCurrentUser, resetStore } from "@/shared/lib/demo-store";

const DEMO_EMAIL = "alex@example.com";
const DEMO_PASSWORD = "mono123";

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    email?: string;
    password?: string;
  };

  if (!payload.email?.trim() || !payload.password) {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "Email and password are required." },
      { status: 400 },
    );
  }

  if (
    payload.email.toLowerCase() !== DEMO_EMAIL ||
    payload.password !== DEMO_PASSWORD
  ) {
    return NextResponse.json(
      { code: "INVALID_CREDENTIALS", message: "Email or password is incorrect." },
      { status: 401 },
    );
  }

  resetStore();
  const tokens = generateDemoTokens();
  const user = getCurrentUser();

  const response = NextResponse.json({
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
  response.cookies.set(createDemoSessionCookie());

  return response;
}
