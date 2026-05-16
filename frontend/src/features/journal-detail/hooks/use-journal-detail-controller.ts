"use client";

import { useParams } from "next/navigation";

import { useJournalByDateQuery } from "@/shared/repository/journals/query";

export function useJournalDetailController() {
  const params = useParams<{ date: string }>();
  const date = typeof params?.date === "string" ? params.date : "";
  const journalQuery = useJournalByDateQuery(date);

  return {
    date,
    journalQuery,
  };
}
