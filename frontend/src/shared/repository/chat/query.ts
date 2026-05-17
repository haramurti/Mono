"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getTodayChat, sendChatMessage } from "@/shared/repository/chat/action";
import type { SendChatMessageRequestDto } from "@/shared/repository/chat/dto";
import { journalQueryKeys } from "@/shared/repository/journals/query";

export const chatQueryKeys = {
  today: ["chat", "today"] as const,
};

export function useTodayChatQuery() {
  return useQuery({
    queryKey: chatQueryKeys.today,
    queryFn: getTodayChat,
  });
}

export function useSendChatMessageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendChatMessageRequestDto) =>
      sendChatMessage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.today });
      queryClient.invalidateQueries({
        queryKey: journalQueryKeys.calendarRoot,
      });
    },
  });
}
