import { formatLongDate, getTodayDateKey } from "@/shared/lib/date";
import { moodMeta } from "@/shared/lib/moods";
import type { TodayChatResponseDto } from "@/shared/repository/chat/dto";
import type { ChatMessage, Mood } from "@/shared/types/mono";

export type JournalChatMessageItem = {
  id: string;
  content: string;
  isAssistant: boolean;
  avatarFallback: string;
};

export function buildInitialMoodMessage(mood: Mood) {
  return `I feel ${mood} today.`;
}

export function getChatDateLabel() {
  return formatLongDate(getTodayDateKey());
}

export function getJournalHref(chat: TodayChatResponseDto | undefined) {
  return chat?.journalState.status === "summarized" ||
    chat?.journalState.status === "edited"
    ? `/journal/${chat.date}`
    : undefined;
}

export function getMoodBadgeProps(initialMood: Mood | null | undefined) {
  if (initialMood) {
    return {
      label: moodMeta[initialMood].label,
      variant: "secondary" as const,
    };
  }

  return {
    label: "Mood not selected",
    variant: "ghost" as const,
  };
}

export function getSummaryStateLabel(canSummarize: boolean | undefined) {
  return canSummarize ? "Summary ready" : "Keep writing";
}

export function getHelperText({
  canSummarize,
  initialMood,
  isLoading,
  userMessageCount,
}: {
  canSummarize: boolean | undefined;
  initialMood: Mood | null | undefined;
  isLoading: boolean;
  userMessageCount: number;
}) {
  if (!isLoading && !initialMood) {
    return "Open tools to set your mood before you start writing.";
  }

  if (canSummarize) {
    return "You can summarize now, or keep writing a little longer.";
  }

  const remainingMessagesToSummarize = Math.max(0, 3 - userMessageCount);
  const messageLabel =
    remainingMessagesToSummarize === 1 ? "message" : "messages";

  return `${remainingMessagesToSummarize} more ${messageLabel} to unlock summary.`;
}

export function getUserInitials(userName: string | undefined) {
  return userName?.slice(0, 2).toUpperCase() ?? "YO";
}

export function mapChatMessagesForDisplay(
  messages: ChatMessage[] | undefined,
  userName: string | undefined,
): JournalChatMessageItem[] {
  const userInitials = getUserInitials(userName);

  return (
    messages?.map((message) => ({
      id: message.id,
      content: message.content,
      isAssistant: message.role === "assistant",
      avatarFallback: message.role === "assistant" ? "MO" : userInitials,
    })) ?? []
  );
}

export function shouldRedirectToJournal(
  chat: TodayChatResponseDto | undefined,
) {
  return Boolean(getJournalHref(chat));
}

export function shouldShowSummaryOffer({
  offerDismissed,
  shouldOfferSummary,
}: {
  offerDismissed: boolean;
  shouldOfferSummary: boolean | undefined;
}) {
  return Boolean(shouldOfferSummary) && !offerDismissed;
}
