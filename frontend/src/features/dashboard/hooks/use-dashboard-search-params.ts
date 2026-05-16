"use client";

import { parseAsString, useQueryState } from "nuqs";

import { getCurrentMonthKey } from "@/shared/lib/date";

export function useDashboardSearchParams() {
  const [month, setMonth] = useQueryState(
    "month",
    parseAsString.withDefault(getCurrentMonthKey()),
  );

  return {
    month,
    setMonth,
  };
}
