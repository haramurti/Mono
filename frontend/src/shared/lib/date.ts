import {
  addDays,
  endOfMonth,
  format,
  isAfter,
  isSameDay,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export function getTodayDateKey() {
  return format(new Date(), "yyyy-MM-dd");
}

export function getCurrentMonthKey() {
  return format(new Date(), "yyyy-MM");
}

export function formatDateKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function formatMonthKey(date: Date) {
  return format(date, "yyyy-MM");
}

export function formatLongDate(dateKey: string) {
  return format(parseISO(dateKey), "MMMM d, yyyy");
}

export function formatMonthLabel(monthKey: string) {
  return format(parseISO(`${monthKey}-01`), "MMMM yyyy");
}

export function buildCalendarDates(monthKey: string) {
  const monthStart = parseISO(`${monthKey}-01`);
  const calendarStart = startOfWeek(startOfMonth(monthStart), {
    weekStartsOn: 0,
  });
  const lastDay = endOfMonth(monthStart);

  return Array.from({ length: 42 }, (_, index) =>
    addDays(calendarStart, index),
  ).filter((date, _index, dates) => {
    const lastNeeded = dates.findLast(
      (candidate) =>
        isSameDay(candidate, lastDay) ||
        (isAfter(candidate, lastDay) && candidate.getDay() === 6),
    );

    return lastNeeded ? date <= lastNeeded : true;
  });
}
