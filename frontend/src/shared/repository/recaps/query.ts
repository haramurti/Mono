"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  generateMonthlyRecap,
  getMonthlyRecap,
} from "@/shared/repository/recaps/action";
import type { GenerateMonthlyRecapRequestDto } from "@/shared/repository/recaps/dto";

export const recapsQueryKeys = {
  all: ["recaps"] as const,
  monthlyRoot: ["recaps", "monthly"] as const,
  monthly: (month: string) => [...recapsQueryKeys.monthlyRoot, month] as const,
};

export function useMonthlyRecapQuery(month: string) {
  return useQuery({
    queryKey: recapsQueryKeys.monthly(month),
    queryFn: () => getMonthlyRecap(month),
    enabled: Boolean(month),
  });
}

export function useGenerateMonthlyRecapMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GenerateMonthlyRecapRequestDto) =>
      generateMonthlyRecap(payload),
    onSuccess: (recap) => {
      queryClient.invalidateQueries({ queryKey: recapsQueryKeys.monthlyRoot });
      queryClient.setQueryData(recapsQueryKeys.monthly(recap.month), recap);
    },
  });
}
