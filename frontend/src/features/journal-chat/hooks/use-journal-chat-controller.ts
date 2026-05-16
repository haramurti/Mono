"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useJournalChatSearchParams } from "@/features/journal-chat/hooks/use-journal-chat-search-params";
import {
  buildInitialMoodMessage,
  getJournalHref,
  shouldRedirectToJournal,
} from "@/features/journal-chat/lib/journal-chat-display";
import { toast } from "@/shared/components/ui/sonner";
import { useCurrentUserQuery } from "@/shared/repository/auth/query";
import {
  useSendChatMessageMutation,
  useTodayChatQuery,
} from "@/shared/repository/chat/query";
import { useSummarizeTodayJournalMutation } from "@/shared/repository/journals/query";
import type { Mood } from "@/shared/types/mono";

function addEscapeListener(onEscape: () => void) {
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onEscape();
    }
  };

  window.addEventListener("keydown", handleEscape);

  return () => {
    window.removeEventListener("keydown", handleEscape);
  };
}

function lockBodyScroll() {
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = previousOverflow;
  };
}

export function useJournalChatController() {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [isToolsSheetOpen, setIsToolsSheetOpen] = useState(false);
  const [isSummaryOfferDismissed, setIsSummaryOfferDismissed] = useState(false);
  const { isContinuing, setIsContinuing } = useJournalChatSearchParams();

  const userQuery = useCurrentUserQuery();
  const todayChatQuery = useTodayChatQuery();
  const sendMessageMutation = useSendChatMessageMutation();
  const summarizeMutation = useSummarizeTodayJournalMutation();

  const chat = todayChatQuery.data;
  const journalHref = getJournalHref(chat);

  useEffect(() => {
    if (!isContinuing && shouldRedirectToJournal(chat) && journalHref) {
      router.replace(journalHref);
    }
  }, [chat, isContinuing, journalHref, router]);

  useEffect(() => {
    if (!isContinuing) {
      return;
    }

    if (
      chat?.journalState.status === "in_progress" ||
      chat?.journalState.status === "empty"
    ) {
      void setIsContinuing(null);
    }
  }, [chat?.journalState.status, isContinuing, setIsContinuing]);

  useEffect(() => {
    if (!isToolsSheetOpen) {
      return;
    }

    const unlockBodyScroll = lockBodyScroll();
    const removeEscapeListener = addEscapeListener(() => {
      setIsToolsSheetOpen(false);
    });

    return () => {
      unlockBodyScroll();
      removeEscapeListener();
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
    if (chat?.initialMood || sendMessageMutation.isPending) {
      return;
    }

    resetSummaryOffer();
    closeToolsSheet();
    sendMessageMutation.mutate({
      content: buildInitialMoodMessage(mood),
      initialMood: mood,
    });
  }

  function sendMessage() {
    const content = draft.trim();

    if (!content) {
      return;
    }

    resetSummaryOffer();
    sendMessageMutation.mutate(
      { content },
      {
        onSuccess: () => {
          setDraft("");
        },
      },
    );
  }

  function summarizeJournal() {
    summarizeMutation.mutate(undefined, {
      onSuccess: (journal) => {
        router.push(`/journal/${journal.date}`);
      },
      onError: () => {
        toast.error("Couldn’t summarize your journal.", {
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
