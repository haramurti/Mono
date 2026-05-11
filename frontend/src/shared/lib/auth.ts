import type { NextRequest } from "next/server";

export const DEMO_SESSION_COOKIE = "mono-demo-session";
const DEMO_SESSION_VALUE = "active";

export function createDemoSessionCookie() {
  return {
    name: DEMO_SESSION_COOKIE,
    value: DEMO_SESSION_VALUE,
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function hasDemoSession(request: NextRequest) {
  return request.cookies.get(DEMO_SESSION_COOKIE)?.value === DEMO_SESSION_VALUE;
}
