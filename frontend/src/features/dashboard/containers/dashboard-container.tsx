"use client";

import { addMonths, parseISO, subMonths } from "date-fns";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { DashboardCalendar } from "@/features/dashboard/components/dashboard-calendar";
import { MonthlyRecapCard } from "@/features/dashboard/components/monthly-recap-card";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  formatMonthKey,
  formatMonthLabel,
  getCurrentMonthKey,
} from "@/shared/lib/date";
import { useCurrentUserQuery } from "@/shared/repository/auth/query";
import { useTodayChatQuery } from "@/shared/repository/chat/query";
import { useCalendarQuery } from "@/shared/repository/journals/query";

function getTodayCta(status: string) {
  if (status === "in_progress") {
    return {
      label: "Continue today’s journal",
      href: "/chat",
    };
  }

  if (status === "summarized" || status === "edited") {
    return {
      label: "View today’s reflection",
      href: `/journal/${new Date().toISOString().slice(0, 10)}`,
    };
  }

  return {
    label: "Start today’s journal",
    href: "/chat",
  };
}

export function DashboardContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const month = searchParams.get("month") ?? getCurrentMonthKey();
  const monthDate = parseISO(`${month}-01`);

  const userQuery = useCurrentUserQuery();
  const todayChatQuery = useTodayChatQuery();
  const calendarQuery = useCalendarQuery(month);

  const setMonth = (nextMonth: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", nextMonth);
    router.replace(`/dashboard?${params.toString()}`);
  };

  const todayCta = getTodayCta(
    todayChatQuery.data?.journalState.status ?? "empty",
  );

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-6 py-8 md:px-10 lg:px-14">
      <header className="flex flex-col gap-8 border-b border-border/70 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="eyebrow">Dashboard</p>
          <h1 className="display-xl mt-4 text-balance">
            {userQuery.data
              ? `Welcome back, ${userQuery.data.name}.`
              : "Your reflection home base."}
          </h1>
          <p className="body-copy mt-4 max-w-2xl text-balance">
            See the emotional weather of the month, continue today’s journal,
            and return to past reflections with more context.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href={todayCta.href}>{todayCta.label}</Link>
        </Button>
      </header>

      <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="bg-[rgb(255_255_255_/_0.82)]">
          <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Calendar</p>
              <CardTitle className="mt-3">{formatMonthLabel(month)}</CardTitle>
              <CardDescription>
                Open past journals, continue today, and spot the rhythm of
                recent moods.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() =>
                  setMonth(formatMonthKey(subMonths(monthDate, 1)))
                }
              >
                <ArrowLeftIcon />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() =>
                  setMonth(formatMonthKey(addMonths(monthDate, 1)))
                }
              >
                <ArrowRightIcon />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {calendarQuery.isLoading || todayChatQuery.isLoading ? (
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }, (_, index) => (
                  <Skeleton
                    key={`calendar-skeleton-${index + 1}`}
                    className="h-28 rounded-[1.25rem]"
                  />
                ))}
              </div>
            ) : calendarQuery.data && todayChatQuery.data ? (
              <DashboardCalendar
                month={month}
                days={calendarQuery.data.days}
                todayState={todayChatQuery.data.journalState}
              />
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No journal history yet</EmptyTitle>
                  <EmptyDescription>
                    Start with today’s feeling and the calendar will begin to
                    fill itself in.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-5">
          <Card className="bg-[rgb(255_255_255_/_0.82)]">
            <CardHeader>
              <p className="eyebrow">Current streak</p>
              <CardTitle>
                {calendarQuery.data
                  ? `${calendarQuery.data.streak} day streak`
                  : "Loading streak"}
              </CardTitle>
              <CardDescription>
                Consecutive days with a summarized or edited reflection.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              The streak is meant to feel supportive, not punitive. Missing a
              day does not erase the value of what you already noticed.
            </CardContent>
          </Card>

          {calendarQuery.data ? (
            <MonthlyRecapCard recap={calendarQuery.data.monthlyRecap} />
          ) : (
            <Skeleton className="h-72 rounded-[1.5rem]" />
          )}
        </div>
      </section>
    </main>
  );
}
