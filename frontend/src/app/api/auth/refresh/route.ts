import { NextResponse } from "next/server";

import { generateDemoTokens } from "@/shared/lib/auth";

export async function POST(request: Request) {
  const payload = (await request.json()) as { refreshToken?: string };

  if (!payload.refreshToken) {
    return NextResponse.json(
      { code: "INVALID_REFRESH_TOKEN", message: "Refresh token is invalid or has expired." },
      { status: 401 },
    );
  }

  const tokens = generateDemoTokens();

  return NextResponse.json({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
}
