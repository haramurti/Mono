"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

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
import { Button } from "@/shared/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function JournalDetailContainer() {
  const { date, journalQuery } = useJournalDetailController();
  const journal = journalQuery.data;
  const canRenderJournal = hasRenderableJournal(journal);

  const journalHref = `/journal/${date}`;

  function renderHeaderAction() {
    return (
      <div className="flex gap-2">
        <Button asChild variant="ghost">
          <Link href="/history">
            <ArrowLeftIcon data-icon="inline-start" />
            History
          </Link>
        </Button>
        <Button asChild>
          <Link href="/capture">Start capture</Link>
        </Button>
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

  function renderJournalContent() {
    if (!journal) {
      return null;
    }

    return (
      <>
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
      </>
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
        title="Today’s journal"
        description="Structured reflection from your guided conversation."
        action={renderHeaderAction()}
      >
        {journalQuery.isError || !canRenderJournal
          ? renderEmptyState()
          : renderJournalContent()}
      </AppShellCard>
    </AppShellLayout>
  );
}
