import { apiClient } from "@/shared/lib/axios";
import type { CalendarResponse, Journal } from "@/shared/types/mono";

export async function getCalendar(month: string) {
  const response = await apiClient.get<CalendarResponse>("/journals/calendar", {
    params: { month },
  });
  return response.data;
}

export async function getJournalByDate(date: string) {
  const response = await apiClient.get<Journal>(`/journals/${date}`);
  return response.data;
}

export async function summarizeTodayJournal() {
  const response = await apiClient.post<Journal>("/journals/today/summarize");
  return response.data;
}
