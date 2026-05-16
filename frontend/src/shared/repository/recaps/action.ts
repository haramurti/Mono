import { apiClient } from "@/shared/lib/axios";

import type {
  GenerateMonthlyRecapRequestDto,
  GenerateMonthlyRecapResponseDto,
  GetMonthlyRecapResponseDto,
} from "./dto";

export async function getMonthlyRecap(month: string) {
  const response = await apiClient.get<GetMonthlyRecapResponseDto>(
    "/recaps/monthly",
    {
      params: { month },
    },
  );
  return response.data;
}

export async function generateMonthlyRecap(
  payload: GenerateMonthlyRecapRequestDto,
) {
  const response = await apiClient.post<GenerateMonthlyRecapResponseDto>(
    "/recaps/monthly/generate",
    payload,
  );
  return response.data;
}
