import type {
  CalendarDay,
  EmotionTag,
  Journal,
  MonthlyRecapCard,
  Mood,
  TopicTag,
} from "@/shared/types/mono";

export type GetCalendarParamsDto = {
  month: string;
};

export type CalendarResponseDto = {
  month: string;
  streak: number;
  days: CalendarDay[];
  monthlyRecap: MonthlyRecapCard;
};

export type JournalDetailResponseDto = Journal;
export type SummarizeTodayJournalResponseDto = Journal;

export type UpdateJournalByDateRequestDto = {
  title?: string;
  summary?: string;
  primaryMood?: Mood;
  emotionTags?: EmotionTag[];
  topicTags?: TopicTag[];
};
