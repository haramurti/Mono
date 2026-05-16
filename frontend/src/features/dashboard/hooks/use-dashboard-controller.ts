"use client";

import { addMonths, parseISO, subMonths } from "date-fns";

import { useDashboardSearchParams } from "@/features/dashboard/hooks/use-dashboard-search-params";
import { formatMonthKey } from "@/shared/lib/date";
import { useCurrentUserQuery } from "@/shared/repository/auth/query";
import { useTodayChatQuery } from "@/shared/repository/chat/query";
import { useCalendarQuery } from "@/shared/repository/journals/query";

export function useDashboardController() {
  const { month, setMonth } = useDashboardSearchParams();
  const monthDate = parseISO(`${month}-01`);

  const userQuery = useCurrentUserQuery();
  const todayChatQuery = useTodayChatQuery();
  const calendarQuery = useCalendarQuery(month);

  function goToPreviousMonth() {
    void setMonth(formatMonthKey(subMonths(monthDate, 1)));
  }

  function goToNextMonth() {
    void setMonth(formatMonthKey(addMonths(monthDate, 1)));
  }

  return {
    calendarQuery,
    goToNextMonth,
    goToPreviousMonth,
    month,
    todayChatQuery,
    user: userQuery.data,
  };
}
