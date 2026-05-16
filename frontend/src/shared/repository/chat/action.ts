import { apiClient } from "@/shared/lib/axios";
import type {
  SendChatMessageRequestDto,
  SendChatMessageResponseDto,
  TodayChatResponseDto,
} from "./dto";

export async function getTodayChat() {
  const response = await apiClient.get<TodayChatResponseDto>("/chat/today");
  return response.data;
}

export async function sendChatMessage(payload: SendChatMessageRequestDto) {
  const response = await apiClient.post<SendChatMessageResponseDto>(
    "/chat/messages",
    payload,
  );
  return response.data;
}
