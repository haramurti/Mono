import { type NextRequest, NextResponse } from "next/server";
import { hasDemoSession } from "@/shared/lib/auth";
import { getTodayChat, sendChatMessage } from "@/shared/lib/demo-store";
import type { SendChatMessageRequestDto } from "@/shared/repository/chat/dto";
import { moods } from "@/shared/types/mono";

export function GET(request: NextRequest) {
  if (!hasDemoSession(request)) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "Authentication is required." },
      { status: 401 },
    );
  }
  return NextResponse.json(getTodayChat());
}

export async function POST(request: NextRequest) {
  if (!hasDemoSession(request)) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "Authentication is required." },
      { status: 401 },
    );
  }

  const payload = (await request.json()) as SendChatMessageRequestDto;

  if (!payload.content?.trim()) {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "Content is required." },
      { status: 400 },
    );
  }

  if (
    payload.initialMood &&
    !moods.includes(payload.initialMood as (typeof moods)[number])
  ) {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "Invalid mood." },
      { status: 400 },
    );
  }

  return NextResponse.json(
    sendChatMessage({
      content: payload.content.trim(),
      initialMood: payload.initialMood as (typeof moods)[number] | null,
    }),
  );
}
