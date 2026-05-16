import { type NextRequest, NextResponse } from "next/server";

import { hasDemoSession } from "@/shared/lib/auth";
import { generateMonthlyRecap } from "@/shared/lib/demo-store";

export async function POST(request: NextRequest) {
  if (!hasDemoSession(request)) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "Authentication is required." },
      { status: 401 },
    );
  }

  const payload = (await request.json()) as { month?: string };
  if (!payload.month || !/^\d{4}-\d{2}$/.test(payload.month)) {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "Month must use YYYY-MM format." },
      { status: 400 },
    );
  }

  const recap = generateMonthlyRecap(payload.month);
  if (!recap) {
    return NextResponse.json(
      {
        code: "NOT_ENOUGH_MONTHLY_DATA",
        message:
          "You need at least 3 journal entries this month to generate a monthly recap.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json(recap);
}
