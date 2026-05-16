import type {
  ChatActions,
  ChatMessage,
  JournalState,
  Mood,
} from "@/shared/types/mono";

export type SendChatMessageRequestDto = {
  content: string;
  initialMood?: Mood | null;
};

export type SendChatMessageResponseDto = {
  message: ChatMessage;
  actions: ChatActions;
  journalState: JournalState;
};

export type TodayChatResponseDto = {
  date: string;
  initialMood: Mood | null;
  messages: ChatMessage[];
  actions: ChatActions;
  journalState: JournalState;
};
