"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { deriveActions } from "@/features/journal-chat/lib/journal-chat-display";
import { toast } from "@/shared/components/ui/sonner";
import { getTodayDateKey } from "@/shared/lib/date";
import { useCurrentUserQuery } from "@/shared/repository/auth/query";
import {
  useSendChatMessageMutation,
  useTodayChatQuery,
} from "@/shared/repository/chat/query";
import {
  useJournalByDateQuery,
  useSummarizeTodayJournalMutation,
} from "@/shared/repository/journals/query";
import type { Mood } from "@/shared/types/mono";

export function useJournalChatController() {
  const router = useRouter();
  const today = getTodayDateKey();

  const [draft, setDraft] = useState("");
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [isToolsSheetOpen, setIsToolsSheetOpen] = useState(false);
  const [isSummaryOfferDismissed, setIsSummaryOfferDismissed] = useState(false);

  const userQuery = useCurrentUserQuery();
  const todayChatQuery = useTodayChatQuery();
  const sendMessageMutation = useSendChatMessageMutation();
  const summarizeMutation = useSummarizeTodayJournalMutation();

  const chat = todayChatQuery.data;
  const journalExists =
    chat?.journalState.status === "in_progress" ||
    chat?.journalState.status === "summarized" ||
    chat?.journalState.status === "edited";

  const todayJournalQuery = useJournalByDateQuery(journalExists ? today : "");

  // Source of truth for the current mood:
  // - When the journal exists, read from journal.primaryMood (spec-compliant).
  // - Otherwise, fall back to local selectedMood (chosen but not yet persisted).
  const journalMood = todayJournalQuery.data?.primaryMood ?? null;
  const initialMood = journalMood ?? selectedMood;

  const actions = useMemo(
    () => (chat ? deriveActions(chat.journalState) : undefined),
    [chat],
  );

  useEffect(() => {
    if (!isToolsSheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsToolsSheetOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onEsc);
    };
  }, [isToolsSheetOpen]);

  function openToolsSheet() {
    setIsToolsSheetOpen(true);
  }

  function closeToolsSheet() {
    setIsToolsSheetOpen(false);
  }

  function dismissSummaryOffer() {
    setIsSummaryOfferDismissed(true);
  }

  function resetSummaryOffer() {
    setIsSummaryOfferDismissed(false);
  }

  function changeDraft(value: string) {
    setDraft(value);
  }

  function selectMood(mood: Mood) {
    if (journalMood || sendMessageMutation.isPending) return;
    setSelectedMood(mood);
    closeToolsSheet();
  }

  function sendMessage() {
    const content = draft.trim();
    if (!content) return;
    if (!initialMood) return;

    resetSummaryOffer();
    // Only attach initialMood on the very first POST for this journal.
    // Once the journal has primaryMood, subsequent sends omit it.
    const includeMood = !journalMood;

    sendMessageMutation.mutate(
      includeMood
        ? { content, initialMood: selectedMood ?? initialMood }
        : { content },
      { onSuccess: () => setDraft("") },
    );
  }

  function summarizeJournal() {
    summarizeMutation.mutate(undefined, {
      onSuccess: (journal) => {
        router.push(`/journal/${journal.date}`);
      },
      onError: () => {
        toast.error("Couldn't summarize your journal.", {
          description: "Your chat is saved. Try again in a moment.",
        });
      },
    });
  }

  function retrySummarize() {
    summarizeMutation.reset();
    summarizeJournal();
  }

  return {
    chat,
    initialMood,
    actions,
    closeToolsSheet,
    draft,
    changeDraft,
    dismissSummaryOffer,
    isBusy:
      todayChatQuery.isLoading ||
      sendMessageMutation.isPending ||
      summarizeMutation.isPending,
    isChatLoading: todayChatQuery.isLoading,
    isSendPending: sendMessageMutation.isPending,
    isSummarizePending: summarizeMutation.isPending,
    isSummaryOfferDismissed,
    isToolsSheetOpen,
    openToolsSheet,
    retrySummarize,
    selectMood,
    sendMessage,
    summarizeError: summarizeMutation.error,
    summarizeJournal,
    user: userQuery.data,
  };
}
