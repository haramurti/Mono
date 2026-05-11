import { type NextRequest, NextResponse } from "next/server";

import { hasDemoSession } from "@/shared/lib/auth";
import { getJournalByDate } from "@/shared/lib/demo-store";

export function GET(
  request: NextRequest,
  context: { params: Promise<{ date: string }> },
) {
  if (!hasDemoSession(request)) {
    return NextResponse.json(
      {
        code: "UNAUTHORIZED",
        message: "Authentication is required.",
      },
      { status: 401 },
    );
  }

  return context.params.then(({ date }) => {
    const journal = getJournalByDate(date);

    if (!journal) {
      return NextResponse.json(
        {
          code: "JOURNAL_NOT_FOUND",
          message: "No journal found for this date.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(journal);
  });
}
