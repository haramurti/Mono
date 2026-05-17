// Demo-only auxiliary route. NOT part of the OpenAPI contract.
// Parallel to /api/demo-login: this clears the local demo session cookie that
// the contract-defined bearerAuth flow does not require. When a real bearer
// auth backend replaces the demo, this file should be deleted and
// useLogoutMutation should become a pure client-side token-discard action.

import { type NextRequest, NextResponse } from "next/server";

import { DEMO_SESSION_COOKIE, hasDemoSession } from "@/shared/lib/auth";

export function POST(request: NextRequest) {
  if (!hasDemoSession(request)) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "Authentication is required." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: DEMO_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
