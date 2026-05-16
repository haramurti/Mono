import { NextResponse } from "next/server";

import { createDemoSessionCookie } from "@/shared/lib/auth";
import { getCurrentUser } from "@/shared/lib/demo-store";

export async function POST(request: Request) {
  const payload = (await request.json()) as { idToken?: string };

  if (!payload.idToken?.trim()) {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "idToken is required." },
      { status: 400 },
    );
  }

  const response = NextResponse.json({
    user: getCurrentUser(),
    accessToken: null,
  });
  response.cookies.set(createDemoSessionCookie());

  return response;
}
