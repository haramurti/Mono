"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getCalendar,
  getJournalByDate,
  summarizeTodayJournal,
} from "@/shared/repository/journals/action";

export const journalQueryKeys = {
  all: ["journals"] as const,
  calendarRoot: ["journals", "calendar"] as const,
  calendar: (month: string) =>
    [...journalQueryKeys.calendarRoot, month] as const,
  detailRoot: ["journals", "detail"] as const,
  detail: (date: string) => [...journalQueryKeys.detailRoot, date] as const,
};

export function useCalendarQuery(month: string) {
  return useQuery({
    queryKey: journalQueryKeys.calendar(month),
    queryFn: () => getCalendar(month),
  });
}

export function useJournalByDateQuery(date: string) {
  return useQuery({
    queryKey: journalQueryKeys.detail(date),
    queryFn: () => getJournalByDate(date),
    enabled: Boolean(date),
  });
}

export function useSummarizeTodayJournalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: summarizeTodayJournal,
    onSuccess: (journal) => {
      queryClient.invalidateQueries({
        queryKey: journalQueryKeys.calendarRoot,
      });
      queryClient.invalidateQueries({ queryKey: ["chat", "today"] });
      queryClient.setQueryData(journalQueryKeys.detail(journal.date), journal);
    },
  });
}
