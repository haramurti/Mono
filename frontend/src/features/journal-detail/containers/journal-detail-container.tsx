"use client";

import { ArrowLeftIcon, PencilIcon, PlayIcon } from "lucide-react";
import Link from "next/link";

import { JournalDetailEditForm } from "@/features/journal-detail/components/journal-detail-edit-form";
import { JournalDetailOverviewCard } from "@/features/journal-detail/components/journal-detail-overview-card";
import { JournalDetailSummaryCard } from "@/features/journal-detail/components/journal-detail-summary-card";
import { useJournalDetailController } from "@/features/journal-detail/hooks/use-journal-detail-controller";
import {
  formatTagLabel,
  getFormattedDate,
  getMoodBadgeLabel,
  getMoodIntensityLabel,
  hasRenderableJournal,
} from "@/features/journal-detail/lib/journal-detail-display";
import {
  AppShellCard,
  AppShellLayout,
} from "@/shared/components/app/auth-app-shell";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { getTodayDateKey } from "@/shared/lib/date";

export function JournalDetailContainer() {
  const {
    date,
    editForm,
    enterEditMode,
    exitEditMode,
    isEditing,
    isSavingEdit,
    journalQuery,
    saveEdit,
    saveEditError,
  } = useJournalDetailController();
  const journal = journalQuery.data;
  const canRenderJournal = hasRenderableJournal(journal);
  const journalIsEditable =
    Boolean(journal) &&
    (journal?.status === "summarized" || journal?.status === "edited");
  const canContinueJournaling =
    journalIsEditable && journal?.date === getTodayDateKey();

  const journalHref = `/journal/${date}`;

  function renderHeaderAction() {
    if (isEditing) {
      return (
        <Button asChild variant="ghost">
          <Link href="/history">
            <ArrowLeftIcon data-icon="inline-start" />
            History
          </Link>
        </Button>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="ghost">
          <Link href="/history">
            <ArrowLeftIcon data-icon="inline-start" />
            History
          </Link>
        </Button>
        {canContinueJournaling ? (
          <Button asChild variant="outline">
            <Link href="/capture?continue=true">
              <PlayIcon data-icon="inline-start" />
              Continue journaling
            </Link>
          </Button>
        ) : null}
        {journalIsEditable ? (
          <Button variant="outline" onClick={enterEditMode}>
            <PencilIcon data-icon="inline-start" />
            Edit
          </Button>
        ) : null}
      </div>
    );
  }

  function renderLoadingState() {
    return (
      <div className="grid gap-5">
        <Skeleton className="h-64 rounded-[1.5rem]" />
        <Skeleton className="h-80 rounded-[1.5rem]" />
      </div>
    );
  }

  function renderEmptyState() {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No journal found for this date.</EmptyTitle>
          <EmptyDescription>
            This date does not have a saved reflection yet.
          </EmptyDescription>
        </EmptyHeader>
        <Button asChild>
          <Link href="/history">Return to history</Link>
        </Button>
      </Empty>
    );
  }

  function renderEditMode() {
    if (!journal) {
      return null;
    }

    return (
      <div className="grid gap-5">
        {saveEditError ? (
          <Alert variant="destructive">
            <AlertTitle>Couldn’t save your changes.</AlertTitle>
            <AlertDescription>
              Your edits weren’t saved. Try saving again, or cancel to discard.
            </AlertDescription>
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={saveEdit}
                disabled={isSavingEdit}
              >
                Retry save
              </Button>
            </div>
          </Alert>
        ) : null}
        <JournalDetailEditForm
          form={editForm}
          isSubmitting={isSavingEdit}
          onCancel={exitEditMode}
          onSubmit={saveEdit}
        />
      </div>
    );
  }

  function renderReadOnlyContent() {
    if (!journal) {
      return null;
    }

    return (
      <div className="grid gap-5">
        <JournalDetailOverviewCard
          emotionTags={journal.emotionTags.map(formatTagLabel)}
          formattedDate={getFormattedDate(journal.date) ?? ""}
          isEdited={journal.isEdited}
          moodBadgeLabel={getMoodBadgeLabel(journal.primaryMood) ?? "unknown"}
          moodIntensityLabel={getMoodIntensityLabel(journal.moodIntensity)}
          title={journal.title ?? "Untitled reflection"}
          topicTags={journal.topicTags.map(formatTagLabel)}
        />
        <JournalDetailSummaryCard
          keyInsight={journal.keyInsight}
          suggestedNextAction={journal.suggestedNextAction}
          summary={journal.summary}
        />
      </div>
    );
  }

  if (journalQuery.isLoading) {
    return (
      <AppShellLayout activeSection="journal" journalHref={journalHref}>
        <AppShellCard
          title="Today’s journal"
          description="Structured reflection from your guided conversation."
          action={renderHeaderAction()}
        >
          {renderLoadingState()}
        </AppShellCard>
      </AppShellLayout>
    );
  }

  return (
    <AppShellLayout activeSection="journal" journalHref={journalHref}>
      <AppShellCard
        title={isEditing ? "Edit reflection" : "Today’s journal"}
        description={
          isEditing
            ? "Adjust title, summary, mood, and tags. Saving marks the entry as edited."
            : "Structured reflection from your guided conversation."
        }
        action={renderHeaderAction()}
      >
        {journalQuery.isError || !canRenderJournal
          ? renderEmptyState()
          : isEditing
            ? renderEditMode()
            : renderReadOnlyContent()}
      </AppShellCard>
    </AppShellLayout>
  );
}
