import { type NextRequest, NextResponse } from "next/server";

import { hasDemoSession } from "@/shared/lib/auth";
import { getCalendarForMonth } from "@/shared/lib/demo-store";

export function GET(request: NextRequest) {
  if (!hasDemoSession(request)) {
    return NextResponse.json(
      {
        code: "UNAUTHORIZED",
        message: "Authentication is required.",
      },
      { status: 401 },
    );
  }

  const month = request.nextUrl.searchParams.get("month");

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json(
      {
        code: "BAD_REQUEST",
        message: "Month must use YYYY-MM format.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json(getCalendarForMonth(month));
}
