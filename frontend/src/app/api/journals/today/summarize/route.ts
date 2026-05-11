import { type NextRequest, NextResponse } from "next/server";

import { hasDemoSession } from "@/shared/lib/auth";
import { summarizeTodayJournal } from "@/shared/lib/demo-store";

export function POST(request: NextRequest) {
  if (!hasDemoSession(request)) {
    return NextResponse.json(
      {
        code: "UNAUTHORIZED",
        message: "Authentication is required.",
      },
      { status: 401 },
    );
  }

  const journal = summarizeTodayJournal();

  if (!journal) {
    return NextResponse.json(
      {
        code: "NOT_ENOUGH_MESSAGES",
        message: "You need at least 3 messages to summarize today's journal.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json(journal);
}
