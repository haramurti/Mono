"use client";

import { useParams } from "next/navigation";

import { useMonthlyRecapQuery } from "@/shared/repository/recaps/query";

export function useRecapDetailController() {
  const params = useParams<{ month: string }>();
  const month = typeof params?.month === "string" ? params.month : "";
  const recapQuery = useMonthlyRecapQuery(month);

  return {
    month,
    recapQuery,
  };
}
