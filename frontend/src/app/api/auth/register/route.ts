import { NextResponse } from "next/server";

import {
  createDemoSessionCookie,
  generateDemoTokens,
} from "@/shared/lib/auth";
import { getCurrentUser, resetStore } from "@/shared/lib/demo-store";

const DEMO_EMAIL = "alex@example.com";

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    name?: string;
    email?: string;
    password?: string;
  };

  if (!payload.name?.trim()) {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "Name is required." },
      { status: 400 },
    );
  }

  if (!payload.email?.trim()) {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "Email is required." },
      { status: 400 },
    );
  }

  if (!payload.password || payload.password.length < 8) {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }

  // Demo: only allow the demo email
  if (payload.email.toLowerCase() !== DEMO_EMAIL) {
    return NextResponse.json(
      { code: "EMAIL_ALREADY_EXISTS", message: "This email is already registered." },
      { status: 409 },
    );
  }

  resetStore();
  const tokens = generateDemoTokens();
  const user = getCurrentUser();

  const response = NextResponse.json(
    { user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken },
    { status: 201 },
  );
  response.cookies.set(createDemoSessionCookie());

  return response;
}
