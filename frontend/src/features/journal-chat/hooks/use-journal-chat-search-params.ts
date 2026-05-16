"use client";

import { parseAsBoolean, useQueryState } from "nuqs";

export function useJournalChatSearchParams() {
  const [isContinuing, setIsContinuing] = useQueryState(
    "continue",
    parseAsBoolean.withDefault(false),
  );

  return {
    isContinuing,
    setIsContinuing,
  };
}
