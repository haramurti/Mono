import { type NextRequest, NextResponse } from "next/server";

import { createDemoSessionCookie } from "@/shared/lib/auth";

export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.cookies.set(createDemoSessionCookie());
  return response;
}
