"use client";

import { DashboardCalendarCell } from "@/features/dashboard/components/dashboard-calendar-cell";
import {
  buildCalendarDates,
  formatDateKey,
  getTodayDateKey,
} from "@/shared/lib/date";
import type { CalendarDay, JournalState } from "@/shared/types/mono";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
      <div className="pb-2">
        <div className="grid grid-cols-7 gap-1.5 md:gap-2">
          {dates.map((date) => {
            return (
              <DashboardCalendarCell
                key={date.toISOString()}
                date={date}
                day={dayMap.get(formatDateKey(date))}
                month={month}
                todayKey={todayKey}
                todayState={todayState}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
