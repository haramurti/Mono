import { type NextRequest, NextResponse } from "next/server";
import { hasDemoSession } from "@/shared/lib/auth";
import { getJournalByDate, updateJournalByDate } from "@/shared/lib/demo-store";
import { emotionTags, moods, topicTags } from "@/shared/types/mono";

function isValidDateParam(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsed = new Date(`${date}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsed.valueOf()) && parsed.toISOString().startsWith(date)
  );
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ date: string }> },
) {
  if (!hasDemoSession(request)) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "Authentication is required." },
      { status: 401 },
    );
  }

  const { date } = await context.params;
  if (!isValidDateParam(date)) {
    return NextResponse.json(
      {
        code: "BAD_REQUEST",
        message: "Date must use YYYY-MM-DD format.",
      },
      { status: 400 },
    );
  }

  const journal = getJournalByDate(date);

  if (!journal) {
    return NextResponse.json(
      { code: "JOURNAL_NOT_FOUND", message: "No journal found for this date." },
      { status: 404 },
    );
  }

  return NextResponse.json(journal);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ date: string }> },
) {
  if (!hasDemoSession(request)) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "Authentication is required." },
      { status: 401 },
    );
  }

  const { date } = await context.params;
  if (!isValidDateParam(date)) {
    return NextResponse.json(
      {
        code: "BAD_REQUEST",
        message: "Date must use YYYY-MM-DD format.",
      },
      { status: 400 },
    );
  }

  const payload = (await request.json()) as {
    title?: string;
    summary?: string;
    primaryMood?: string;
    emotionTags?: string[];
    topicTags?: string[];
  };

  const hasAnyUpdateField =
    typeof payload.title !== "undefined" ||
    typeof payload.summary !== "undefined" ||
    typeof payload.primaryMood !== "undefined" ||
    typeof payload.emotionTags !== "undefined" ||
    typeof payload.topicTags !== "undefined";

  if (!hasAnyUpdateField) {
    return NextResponse.json(
      {
        code: "BAD_REQUEST",
        message: "At least one editable field is required.",
      },
      { status: 400 },
    );
  }

  if (
    typeof payload.title !== "undefined" &&
    (!payload.title.trim() || payload.title.length < 1)
  ) {
    return NextResponse.json(
      {
        code: "BAD_REQUEST",
        message: "Title must contain at least 1 character.",
      },
      { status: 400 },
    );
  }

  if (
    typeof payload.summary !== "undefined" &&
    (!payload.summary.trim() || payload.summary.length < 1)
  ) {
    return NextResponse.json(
      {
        code: "BAD_REQUEST",
        message: "Summary must contain at least 1 character.",
      },
      { status: 400 },
    );
  }

  if (payload.primaryMood && !moods.includes(payload.primaryMood as never)) {
    return NextResponse.json(
      {
        code: "BAD_REQUEST",
        message: "Invalid primaryMood value.",
      },
      { status: 400 },
    );
  }

  if (payload.emotionTags?.some((tag) => !emotionTags.includes(tag as never))) {
    return NextResponse.json(
      {
        code: "BAD_REQUEST",
        message: "Invalid emotionTags value.",
      },
      { status: 400 },
    );
  }

  if (payload.topicTags?.some((tag) => !topicTags.includes(tag as never))) {
    return NextResponse.json(
      {
        code: "BAD_REQUEST",
        message: "Invalid topicTags value.",
      },
      { status: 400 },
    );
  }

  const updated = updateJournalByDate(date, {
    title: payload.title?.trim(),
    summary: payload.summary?.trim(),
    primaryMood: payload.primaryMood as (typeof moods)[number] | undefined,
    emotionTags: payload.emotionTags as
      | (typeof emotionTags)[number][]
      | undefined,
    topicTags: payload.topicTags as (typeof topicTags)[number][] | undefined,
  });

  if (!updated) {
    return NextResponse.json(
      { code: "JOURNAL_NOT_FOUND", message: "No journal found for this date." },
      { status: 404 },
    );
  }

  return NextResponse.json(updated);
}
