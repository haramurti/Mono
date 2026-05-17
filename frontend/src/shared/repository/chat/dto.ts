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

// Aligned with OpenAPI GET /chat/messages response
export type GetChatMessagesResponseDto = {
  messages: ChatMessage[];
  journalState: JournalState;
};
