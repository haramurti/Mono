import { type NextRequest, NextResponse } from "next/server";

import { createDemoSessionCookie } from "@/shared/lib/auth";
import { getTodayChat } from "@/shared/lib/demo-store";

export function GET(request: NextRequest) {
  const todayChat = getTodayChat();
  const targetPath =
    todayChat.journalState.status === "summarized" ||
    todayChat.journalState.status === "edited"
      ? `/journal/${todayChat.date}`
      : "/capture";
  const response = NextResponse.redirect(new URL(targetPath, request.url));
  response.cookies.set(createDemoSessionCookie());
  return response;
}
