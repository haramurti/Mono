import { apiClient } from "@/shared/lib/axios";
import type {
  GetChatMessagesResponseDto,
  SendChatMessageRequestDto,
  SendChatMessageResponseDto,
} from "./dto";

export async function getTodayChat() {
  const response =
    await apiClient.get<GetChatMessagesResponseDto>("/chat/messages");
  return response.data;
}

export async function sendChatMessage(payload: SendChatMessageRequestDto) {
  const response = await apiClient.post<SendChatMessageResponseDto>(
    "/chat/messages",
    payload,
  );
  return response.data;
}
