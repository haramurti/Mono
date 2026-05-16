"use client";

import Link from "next/link";

import { DashboardCalendar } from "@/features/dashboard/components/dashboard-calendar";
import { DashboardCalendarSection } from "@/features/dashboard/components/dashboard-calendar-section";
import { DashboardStreakCard } from "@/features/dashboard/components/dashboard-streak-card";
import { MonthlyRecapCard } from "@/features/dashboard/components/monthly-recap-card";
import { useDashboardController } from "@/features/dashboard/hooks/use-dashboard-controller";
import {
  getDashboardJournalHref,
  getDashboardTitle,
  getStreakLabel,
  getTodayCta,
} from "@/features/dashboard/lib/dashboard-display";
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
import { formatMonthLabel } from "@/shared/lib/date";

export function DashboardContainer() {
  const {
    calendarQuery,
    generateRecap,
    generateRecapError,
    goToNextMonth,
    goToPreviousMonth,
    isGeneratingRecap,
    month,
    todayChatQuery,
    user,
  } = useDashboardController();

  const todayCta = getTodayCta(todayChatQuery.data?.journalState.status);
  const journalHref = getDashboardJournalHref(todayChatQuery.data);
  const isCalendarLoading = calendarQuery.isLoading || todayChatQuery.isLoading;

  function renderCalendarContent() {
    if (isCalendarLoading) {
      return (
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }, (_, index) => (
            <Skeleton
              key={`calendar-skeleton-${index + 1}`}
              className="h-28 rounded-[1.25rem]"
            />
          ))}
        </div>
      );
    }

    if (calendarQuery.data && todayChatQuery.data) {
      return (
        <DashboardCalendar
          month={month}
          days={calendarQuery.data.days}
          todayState={todayChatQuery.data.journalState}
        />
      );
    }

    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No journal history yet</EmptyTitle>
          <EmptyDescription>
            Start with today’s feeling and the calendar will begin to fill
            itself in.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <AppShellLayout activeSection="history" journalHref={journalHref}>
      <AppShellCard
        title={getDashboardTitle(user?.name)}
        description="Review your month, spot emotional patterns, then return to capture for today."
        action={
          <Button asChild size="lg">
            <Link href={todayCta.href}>{todayCta.label}</Link>
          </Button>
        }
      >
        <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <DashboardCalendarSection
            monthLabel={formatMonthLabel(month)}
            onNextMonth={goToNextMonth}
            onPreviousMonth={goToPreviousMonth}
          >
            {renderCalendarContent()}
          </DashboardCalendarSection>

          <div className="grid gap-5">
            <DashboardStreakCard
              streakLabel={getStreakLabel(calendarQuery.data?.streak)}
            />
            {calendarQuery.data ? (
              <MonthlyRecapCard
                recap={calendarQuery.data.monthlyRecap}
                isGenerating={isGeneratingRecap}
                hasError={Boolean(generateRecapError)}
                onGenerate={generateRecap}
                onRetry={generateRecap}
              />
            ) : (
              <Skeleton className="h-72 rounded-[1.5rem]" />
            )}
          </div>
        </section>
      </AppShellCard>
    </AppShellLayout>
  );
}
