import { apiClient } from "@/shared/lib/axios";
import type {
  CalendarResponseDto,
  JournalDetailResponseDto,
  SummarizeTodayJournalResponseDto,
  UpdateJournalByDateRequestDto,
} from "./dto";

export async function getCalendar(month: string) {
  const response = await apiClient.get<CalendarResponseDto>(
    "/journals/calendar",
    {
      params: { month },
    },
  );
  return response.data;
}

export async function getJournalByDate(date: string) {
  const response = await apiClient.get<JournalDetailResponseDto>(
    `/journals/${date}`,
  );
  return response.data;
}

export async function summarizeTodayJournal() {
  const response = await apiClient.post<SummarizeTodayJournalResponseDto>(
    "/journals/today/summarize",
  );
  return response.data;
}

export async function updateJournalByDate(
  date: string,
  payload: UpdateJournalByDateRequestDto,
) {
  const response = await apiClient.patch<JournalDetailResponseDto>(
    `/journals/${date}`,
    payload,
  );
  return response.data;
}
