import type { NextRequest } from "next/server";

export const DEMO_SESSION_COOKIE = "mono-demo-session";
const DEMO_SESSION_VALUE = "active";
const DEMO_TOKEN_PREFIX = "demo_";

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

export function generateDemoTokens() {
  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  return {
    accessToken: `${DEMO_TOKEN_PREFIX}access_${id}`,
    refreshToken: `${DEMO_TOKEN_PREFIX}refresh_${id}`,
  };
}

function hasDemoCookie(request: NextRequest) {
  return request.cookies.get(DEMO_SESSION_COOKIE)?.value === DEMO_SESSION_VALUE;
}

function hasBearerToken(request: NextRequest) {
  const auth = request.headers.get("authorization");
  return Boolean(auth?.startsWith("Bearer ") && auth.length > 7);
}

export function hasValidAuth(request: NextRequest) {
  return hasBearerToken(request) || hasDemoCookie(request);
}

/** @deprecated Use hasValidAuth instead */
export function hasDemoSession(request: NextRequest) {
  return hasValidAuth(request);
}
