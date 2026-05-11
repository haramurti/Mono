import { type NextRequest, NextResponse } from "next/server";
import { hasDemoSession } from "@/shared/lib/auth";
import { getCurrentUser } from "@/shared/lib/demo-store";

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

  return NextResponse.json(getCurrentUser());
}
