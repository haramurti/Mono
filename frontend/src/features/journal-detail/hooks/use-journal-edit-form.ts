"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  journalEditSchema,
  type JournalEditValues,
} from "@/features/journal-detail/schemas/journal-edit-schema";
import type { Journal } from "@/shared/types/mono";

function buildDefaultValues(journal: Journal | undefined): JournalEditValues {
  return {
    title: journal?.title ?? "",
    summary: journal?.summary ?? "",
    primaryMood: journal?.primaryMood ?? "unknown",
    emotionTags: journal?.emotionTags ?? [],
    topicTags: journal?.topicTags ?? [],
  };
}

export function useJournalEditForm(journal: Journal | undefined) {
  const form = useForm<JournalEditValues>({
    resolver: zodResolver(journalEditSchema),
    defaultValues: buildDefaultValues(journal),
    values: buildDefaultValues(journal),
  });

  return form;
}
