"use client";

import { isFuture, isSameMonth, parseISO } from "date-fns";
import Link from "next/link";

import {
  buildCalendarDates,
  formatDateKey,
  getTodayDateKey,
} from "@/shared/lib/date";
import { getMoodEmoji } from "@/shared/lib/moods";
import { cn } from "@/shared/lib/utils";
import type { CalendarDay, JournalState } from "@/shared/types/mono";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getCellLink(
  dateKey: string,
  day: CalendarDay | undefined,
  todayState: JournalState,
) {
  const todayKey = getTodayDateKey();

  if (dateKey === todayKey) {
    if (todayState.status === "empty" || todayState.status === "in_progress") {
      return "/chat";
    }

    if (todayState.status === "summarized" || todayState.status === "edited") {
      return `/journal/${dateKey}`;
    }
  }

  if (day) {
    return `/journal/${dateKey}`;
  }

  return null;
}

export function DashboardCalendar({
  month,
  days,
  todayState,
}: {
  month: string;
  days: CalendarDay[];
  todayState: JournalState;
}) {
  const dates = buildCalendarDates(month);
  const todayKey = getTodayDateKey();
  const dayMap = new Map(days.map((day) => [day.date, day]));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-7 gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {weekdayLabels.map((label) => (
          <div key={label} className="px-2 py-1">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {dates.map((date) => {
          const dateKey = formatDateKey(date);
          const day = dayMap.get(dateKey);
          const isCurrentMonth = isSameMonth(date, parseISO(`${month}-01`));
          const isToday = dateKey === todayKey;
          const disabled = isFuture(date) || (!day && !isToday);
          const href = getCellLink(dateKey, day, todayState);
          const content = (
            <div
              className={cn(
                "flex min-h-28 flex-col rounded-[1.25rem] border border-border/80 bg-card/75 p-3 text-left transition-colors",
                !isCurrentMonth && "opacity-45",
                disabled && "cursor-not-allowed opacity-45",
                isToday && "border-foreground/20 bg-[rgb(255_255_255_/_0.95)]",
              )}
            >
              <div className="flex items-center justify-between text-sm text-foreground">
                <span>{date.getDate()}</span>
                <span>{getMoodEmoji(day?.primaryMood)}</span>
              </div>
              <div className="mt-4 flex flex-1 flex-col justify-end gap-1">
                {day ? (
                  <>
                    <p className="text-sm leading-snug text-card-foreground">
                      {day.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {day.status === "edited"
                        ? "Edited reflection"
                        : "Journal entry"}
                    </p>
                  </>
                ) : isToday ? (
                  <>
                    <p className="text-sm leading-snug text-card-foreground">
                      {todayState.status === "in_progress"
                        ? "Continue today’s journal"
                        : "Start today’s journal"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Today is still open.
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No journal saved.
                  </p>
                )}
              </div>
            </div>
          );

          if (!href || disabled) {
            return <div key={dateKey}>{content}</div>;
          }

          return (
            <Link key={dateKey} href={href} className="block">
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
