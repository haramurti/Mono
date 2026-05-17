"use client";

import { isFuture, isSameMonth, parseISO } from "date-fns";
import Link from "next/link";

import { toast } from "@/shared/components/ui/sonner";
import { formatDateKey, formatLongDate } from "@/shared/lib/date";
import { getMoodEmoji } from "@/shared/lib/moods";
import { cn } from "@/shared/lib/utils";
import type { CalendarDay, JournalState } from "@/shared/types/mono";

type DashboardCalendarCellProps = {
  date: Date;
  day?: CalendarDay;
  month: string;
  todayKey: string;
  todayState: JournalState;
};

function buildCellAriaLabel(
  date: Date,
  day: CalendarDay | undefined,
  isToday: boolean,
) {
  const dateLabel = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  if (day) {
    const statusLabel =
      day.status === "edited"
        ? "Edited reflection available"
        : "Journal entry available";
    return `${dateLabel}. ${statusLabel}. ${day.title}`;
  }

  if (isToday) {
    return `${dateLabel}. Today is open for journaling.`;
  }

  return `${dateLabel}. No journal saved.`;
}

function getCellLink(
  dateKey: string,
  day: CalendarDay | undefined,
  todayKey: string,
  todayState: JournalState,
) {
  if (dateKey === todayKey) {
    if (todayState.status === "empty" || todayState.status === "in_progress") {
      return "/capture";
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

function buildCellClassName({
  isCurrentMonth,
  isDisabled,
  isToday,
}: {
  isCurrentMonth: boolean;
  isDisabled: boolean;
  isToday: boolean;
}) {
  return cn(
    "flex min-h-[6.8rem] flex-col rounded-[1.1rem] border border-border/80 bg-card/75 p-2.5 text-left transition-[colors,transform] duration-200 ease-out md:min-h-[8.1rem] md:p-3",
    !isCurrentMonth && "opacity-45",
    isDisabled && "cursor-not-allowed opacity-45",
    isToday && "border-foreground/20 bg-[var(--surface-glass-solid)]",
  );
}

export function DashboardCalendarCell({
  date,
  day,
  month,
  todayKey,
  todayState,
}: DashboardCalendarCellProps) {
  const dateKey = formatDateKey(date);
  const isCurrentMonth = isSameMonth(date, parseISO(`${month}-01`));
  const isToday = dateKey === todayKey;
  const isFutureDate = isFuture(date);
  const isPastEmpty = !day && !isToday && !isFutureDate;
  const isDisabled = isFutureDate || (!day && !isToday);
  const href = getCellLink(dateKey, day, todayKey, todayState);
  const ariaLabel = buildCellAriaLabel(date, day, isToday);
  const cellClassName = buildCellClassName({
    isCurrentMonth,
    isDisabled,
    isToday,
  });

  const inner = (
    <>
      <div className="flex items-center justify-between text-sm text-foreground">
        <span>{date.getDate()}</span>
        <span>{getMoodEmoji(day?.primaryMood)}</span>
      </div>
      <div className="mt-2 flex flex-1 flex-col justify-end gap-1 md:mt-4">
        {day ? (
          <>
            <p className="truncate text-xs leading-snug text-card-foreground md:text-sm">
              {day.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {day.status === "edited" ? "Edited reflection" : "Journal entry"}
            </p>
          </>
        ) : isToday ? (
          <>
            <p className="text-xs leading-snug text-card-foreground md:text-sm">
              {todayState.status === "in_progress"
                ? "Continue today’s journal"
                : "Start today’s journal"}
            </p>
            <p className="text-xs text-muted-foreground">
              Today is still open.
            </p>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">No journal saved.</p>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block transition-transform duration-200 ease-out hover:-translate-y-0.5"
        aria-label={ariaLabel}
      >
        <div className={cellClassName}>{inner}</div>
      </Link>
    );
  }

  if (isPastEmpty) {
    return (
      <button
        type="button"
        aria-label={ariaLabel}
        className={cn(cellClassName, "w-full text-left")}
        onClick={() => {
          toast("No journal entry for this date.", {
            description: formatLongDate(dateKey),
          });
        }}
      >
        {inner}
      </button>
    );
  }

  return (
    <div
      role="presentation"
      aria-label={ariaLabel}
      aria-disabled="true"
      className={cellClassName}
      title={ariaLabel}
    >
      {inner}
    </div>
  );
}
