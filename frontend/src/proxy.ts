import { type NextRequest, NextResponse } from "next/server";

import { hasDemoSession } from "@/shared/lib/auth";

const protectedPrefixes = ["/dashboard", "/chat", "/journal"];

export function proxy(request: NextRequest) {
  const isProtected = protectedPrefixes.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix),
  );

  if (isProtected && !hasDemoSession(request)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/chat/:path*", "/journal/:path*"],
};
