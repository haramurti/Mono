import { apiClient } from "@/shared/lib/axios";
import type {
  SendChatMessageRequest,
  SendChatMessageResponse,
  TodayChatResponse,
} from "@/shared/types/mono";

export async function getTodayChat() {
  const response = await apiClient.get<TodayChatResponse>("/chat/today");
  return response.data;
}

export async function sendChatMessage(payload: SendChatMessageRequest) {
  const response = await apiClient.post<SendChatMessageResponse>(
    "/chat/messages",
    payload,
  );
  return response.data;
}
