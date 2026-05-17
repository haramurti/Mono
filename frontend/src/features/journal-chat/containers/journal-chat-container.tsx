"use client";

import { JournalChatComposer } from "@/features/journal-chat/components/journal-chat-composer";
import { JournalChatHeader } from "@/features/journal-chat/components/journal-chat-header";
import { JournalChatMessageList } from "@/features/journal-chat/components/journal-chat-message-list";
import { JournalChatSummaryError } from "@/features/journal-chat/components/journal-chat-summary-error";
import { JournalChatSummaryOffer } from "@/features/journal-chat/components/journal-chat-summary-offer";
import { JournalChatSurface } from "@/features/journal-chat/components/journal-chat-surface";
import { JournalChatToolsSheet } from "@/features/journal-chat/components/journal-chat-tools-sheet";
import { MoodPicker } from "@/features/journal-chat/components/mood-picker";
import { useJournalChatController } from "@/features/journal-chat/hooks/use-journal-chat-controller";
import {
  getChatDateLabel,
  getHelperText,
  getMoodBadgeProps,
  getSummaryStateLabel,
  mapChatMessagesForDisplay,
  shouldShowSummaryOffer,
} from "@/features/journal-chat/lib/journal-chat-display";
import { AppShellLayout } from "@/shared/components/app/auth-app-shell";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function JournalChatContainer() {
  const {
    chat,
    closeToolsSheet,
    draft,
    changeDraft,
    dismissSummaryOffer,
    isBusy,
    isChatLoading,
    isSummarizePending,
    isSummaryOfferDismissed,
    isToolsSheetOpen,
    openToolsSheet,
    retrySummarize,
    selectMood,
    sendMessage,
    summarizeError,
    summarizeJournal,
    user,
  } = useJournalChatController();

  const moodBadge = getMoodBadgeProps(chat?.initialMood);
  const messageItems = mapChatMessagesForDisplay(chat?.messages, user?.name);
  const userMessageCount = chat?.journalState.userMessageCount ?? 0;

  const helperText = getHelperText({
    canSummarize: chat?.actions.canSummarize,
    initialMood: chat?.initialMood,
    isLoading: isChatLoading,
    userMessageCount,
  });

  const showSummaryOffer = shouldShowSummaryOffer({
    offerDismissed: isSummaryOfferDismissed,
    shouldOfferSummary: chat?.actions.shouldOfferSummary,
  });

  const isComposerDisabled = !chat?.initialMood || isBusy;
  const isSendDisabled = !draft.trim() || isBusy;
  const isSummarizeDisabled =
    !chat?.initialMood || !chat?.actions.canSummarize || isBusy;
  const moodPickerDisabled = Boolean(chat?.initialMood) || isBusy;

  const toolsSummaryStateLabel = getSummaryStateLabel(
    chat?.actions.canSummarize,
  );

  function renderToolsSheetContent() {
    if (isChatLoading) {
      return (
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton
              key={`mood-skeleton-${index + 1}`}
              className="h-16 rounded-xl"
            />
          ))}
        </div>
      );
    }

    return (
      <>
        <MoodPicker
          value={chat?.initialMood ?? null}
          onSelect={selectMood}
          disabled={moodPickerDisabled}
        />

        {showSummaryOffer ? (
          <JournalChatSummaryOffer
            onDismiss={dismissSummaryOffer}
            onSummarize={summarizeJournal}
          />
        ) : null}
      </>
    );
  }

  function renderEmptyStateToolsContent() {
     if (isChatLoading) {
        return (
           <div className="grid w-full max-w-sm grid-cols-4 gap-2">
              {Array.from({ length: 8 }, (_, index) => (
                 <Skeleton
                    key={`empty-mood-skeleton-${index + 1}`}
                    className="h-16 rounded-xl"
                 />
              ))}
           </div>
        );
     }

     return (
        <div className="motion-settle mx-auto flex w-full max-w-sm flex-col gap-5 p-4">
           <div className="space-y-1 text-center">
              <h2 className="text-sm font-medium text-foreground">
                 How are you feeling today?
              </h2>
              <p className="text-xs leading-relaxed text-muted-foreground">
                 Pick a mood to begin.
              </p>
           </div>

           <MoodPicker
              value={chat?.initialMood ?? null}
              onSelect={selectMood}
              disabled={moodPickerDisabled}
           />

           {showSummaryOffer ? (
              <JournalChatSummaryOffer
                 onDismiss={dismissSummaryOffer}
                 onSummarize={summarizeJournal}
              />
           ) : null}
        </div>
     );
  }

  function renderEmptyState() {
    return (
       <div className="flex flex-1 items-center justify-center px-4 py-8">
          {renderEmptyStateToolsContent()}
       </div>
    );
  }

  return (
    <AppShellLayout activeSection="capture">
      <JournalChatSurface>
        <JournalChatHeader
          dateLabel={getChatDateLabel()}
          isToolsSheetOpen={isToolsSheetOpen}
          moodLabel={moodBadge.label}
          moodVariant={moodBadge.variant}
          onOpenTools={openToolsSheet}
        />

        <div className="mt-4 flex min-h-0 flex-1 flex-col">
          <JournalChatMessageList
            isLoading={isChatLoading}
            messages={messageItems}
            emptyState={renderEmptyState()}
          />

          {summarizeError ? (
            <JournalChatSummaryError
              isRetrying={isSummarizePending}
              onRetry={retrySummarize}
            />
          ) : null}

          <JournalChatComposer
            draft={draft}
            helperText={helperText}
            isComposerDisabled={isComposerDisabled}
            isSendDisabled={isSendDisabled}
            isSummarizeDisabled={isSummarizeDisabled}
            onDraftChange={changeDraft}
            onSend={sendMessage}
            onSummarize={summarizeJournal}
          />
        </div>
      </JournalChatSurface>

      <JournalChatToolsSheet
        isOpen={isToolsSheetOpen}
        moodLabel={moodBadge.label}
        summaryStateLabel={toolsSummaryStateLabel}
        userMessageCount={userMessageCount}
        onClose={closeToolsSheet}
      >
        {renderToolsSheetContent()}
      </JournalChatToolsSheet>
    </AppShellLayout>
  );
}
