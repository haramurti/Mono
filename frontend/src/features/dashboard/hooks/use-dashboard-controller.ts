"use client";

import { addMonths, parseISO, subMonths } from "date-fns";

import { useDashboardSearchParams } from "@/features/dashboard/hooks/use-dashboard-search-params";
import { toast } from "@/shared/components/ui/sonner";
import { formatMonthKey } from "@/shared/lib/date";
import { useCurrentUserQuery } from "@/shared/repository/auth/query";
import { useTodayChatQuery } from "@/shared/repository/chat/query";
import { useCalendarQuery } from "@/shared/repository/journals/query";
import { useGenerateMonthlyRecapMutation } from "@/shared/repository/recaps/query";

export function useDashboardController() {
  const { month, setMonth } = useDashboardSearchParams();
  const monthDate = parseISO(`${month}-01`);

  const userQuery = useCurrentUserQuery();
  const todayChatQuery = useTodayChatQuery();
  const calendarQuery = useCalendarQuery(month);
  const generateRecapMutation = useGenerateMonthlyRecapMutation();

  function goToPreviousMonth() {
    void setMonth(formatMonthKey(subMonths(monthDate, 1)));
  }

  function goToNextMonth() {
    void setMonth(formatMonthKey(addMonths(monthDate, 1)));
  }

  function generateRecap() {
    generateRecapMutation.mutate(
      { month },
      {
        onSuccess: () => {
          toast.success("Monthly recap is ready.");
        },
        onError: () => {
          toast.error("Couldn’t generate your monthly recap.", {
            description: "Your journals are safe. Try again in a moment.",
          });
        },
      },
    );
  }

  return {
    calendarQuery,
    generateRecap,
    generateRecapError: generateRecapMutation.error,
    goToNextMonth,
    goToPreviousMonth,
    isGeneratingRecap: generateRecapMutation.isPending,
    month,
    todayChatQuery,
    user: userQuery.data,
  };
}
