import type {
  MonthlyRecap,
  MonthlyRecapNotEnoughData,
  MonthlyRecapReadyToGenerate,
} from "@/shared/types/mono";

export type GetMonthlyRecapParamsDto = {
  month: string;
};

export type GetMonthlyRecapResponseDto =
  | MonthlyRecap
  | MonthlyRecapNotEnoughData
  | MonthlyRecapReadyToGenerate;

export type GenerateMonthlyRecapRequestDto = {
  month: string;
};

export type GenerateMonthlyRecapResponseDto = MonthlyRecap;
