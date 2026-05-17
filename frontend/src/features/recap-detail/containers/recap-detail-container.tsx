"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import { RecapDetailMoodDistributionCard } from "@/features/recap-detail/components/recap-detail-mood-distribution-card";
import { RecapDetailOverviewCard } from "@/features/recap-detail/components/recap-detail-overview-card";
import { RecapDetailSummaryCard } from "@/features/recap-detail/components/recap-detail-summary-card";
import { RecapDetailTagsCard } from "@/features/recap-detail/components/recap-detail-tags-card";
import { useRecapDetailController } from "@/features/recap-detail/hooks/use-recap-detail-controller";
import {
  formatTagLabel,
  getMoodDistributionRows,
  getMostFrequentMoodLabel,
  getRecapMonthLabel,
} from "@/features/recap-detail/lib/recap-detail-display";
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

export function RecapDetailContainer() {
  const { month, recapQuery } = useRecapDetailController();
  const monthLabel = getRecapMonthLabel(month);
  const recap = recapQuery.data;

  function renderHeaderAction() {
    return (
      <Button asChild variant="ghost">
        <Link href="/history">
          <ArrowLeftIcon data-icon="inline-start" />
          History
        </Link>
      </Button>
    );
  }

  function renderLoadingState() {
    return (
      <div className="grid gap-5">
        <Skeleton className="h-56 rounded-[1.5rem]" />
        <Skeleton className="h-72 rounded-[1.5rem]" />
        <Skeleton className="h-72 rounded-[1.5rem]" />
      </div>
    );
  }

  function renderEmptyState({
    description,
    title,
  }: {
    description: string;
    title: string;
  }) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
        <Button asChild>
          <Link href="/history">Return to history</Link>
        </Button>
      </Empty>
    );
  }

  function renderRecapContent() {
    if (!recap || recap.status !== "generated") {
      return null;
    }

    return (
      <div className="grid gap-5">
        <RecapDetailOverviewCard
          journalCount={recap.journalCount}
          monthLabel={monthLabel}
          mostFrequentMoodLabel={getMostFrequentMoodLabel(recap)}
          summary={recap.summary}
          title={recap.title}
        />
        <RecapDetailSummaryCard
          monthlyInsight={recap.monthlyInsight}
          recurringPattern={recap.recurringPattern}
          suggestedFocusNextMonth={recap.suggestedFocusNextMonth}
        />
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <RecapDetailMoodDistributionCard
            rows={getMoodDistributionRows(recap)}
          />
          <RecapDetailTagsCard
            topEmotionTags={recap.topEmotionTags.map(formatTagLabel)}
            topTopicTags={recap.topTopicTags.map(formatTagLabel)}
          />
        </div>
      </div>
    );
  }

  if (recapQuery.isLoading) {
    return (
      <AppShellLayout activeSection="recap">
        <AppShellCard
          title={monthLabel || "Monthly recap"}
          description="A gentle look at the patterns from this month."
          action={renderHeaderAction()}
        >
          {renderLoadingState()}
        </AppShellCard>
      </AppShellLayout>
    );
  }

  if (recapQuery.isError) {
    return (
      <AppShellLayout activeSection="recap">
        <AppShellCard
          title={monthLabel || "Monthly recap"}
          description="A gentle look at the patterns from this month."
          action={renderHeaderAction()}
        >
          {renderEmptyState({
            title: "Couldn’t load this recap.",
            description:
              "Something went wrong while loading the monthly recap. Try returning to history and reopening it.",
          })}
        </AppShellCard>
      </AppShellLayout>
    );
  }

  if (!recap || recap.status !== "generated") {
    return (
      <AppShellLayout activeSection="recap">
        <AppShellCard
          title={monthLabel || "Monthly recap"}
          description="A gentle look at the patterns from this month."
          action={renderHeaderAction()}
        >
          {renderEmptyState({
            title: "No recap for this month yet.",
            description:
              "Generate a recap from the dashboard once you have at least three summarized or edited journals this month.",
          })}
        </AppShellCard>
      </AppShellLayout>
    );
  }

  return (
    <AppShellLayout activeSection="recap">
      <AppShellCard
        title={monthLabel}
        description="A gentle look at the patterns from this month."
        action={renderHeaderAction()}
      >
        {renderRecapContent()}
      </AppShellCard>
    </AppShellLayout>
  );
}
