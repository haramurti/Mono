import { getTodayDateKey } from "@/shared/lib/date";
import type { GetChatMessagesResponseDto } from "@/shared/repository/chat/dto";

export function getTodayCta(status: string | undefined) {
  if (status === "in_progress") {
    return {
      href: "/capture",
      label: "Continue today’s journal",
    };
  }

  if (status === "summarized" || status === "edited") {
    return {
      href: `/journal/${getTodayDateKey()}`,
      label: "View today’s reflection",
    };
  }

  return {
    href: "/capture",
    label: "Start today’s journal",
  };
}

export function getDashboardTitle(userName: string | undefined) {
  return userName ? `Welcome back, ${userName}.` : "History & insights";
}

export function getDashboardJournalHref(
  todayChat: GetChatMessagesResponseDto | undefined,
) {
  return todayChat?.journalState.status === "summarized" ||
    todayChat?.journalState.status === "edited"
    ? `/journal/${todayChat.journalState.date}`
    : undefined;
}

export function getStreakLabel(streak: number | undefined) {
  return typeof streak === "number" ? `${streak} day streak` : "Loading streak";
}
