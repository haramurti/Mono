"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { useJournalEditForm } from "@/features/journal-detail/hooks/use-journal-edit-form";
import type { JournalEditValues } from "@/features/journal-detail/schemas/journal-edit-schema";
import { toast } from "@/shared/components/ui/sonner";
import {
  useJournalByDateQuery,
  useUpdateJournalByDateMutation,
} from "@/shared/repository/journals/query";

export function useJournalDetailController() {
  const params = useParams<{ date: string }>();
  const date = typeof params?.date === "string" ? params.date : "";
  const journalQuery = useJournalByDateQuery(date);
  const journal = journalQuery.data;

  const updateMutation = useUpdateJournalByDateMutation();
  const editForm = useJournalEditForm(journal ?? undefined);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!journal) {
      setIsEditing(false);
    }
  }, [journal]);

  const enterEditMode = useCallback(() => {
    if (!journal) {
      return;
    }
    editForm.reset({
      title: journal.title ?? "",
      summary: journal.summary ?? "",
      primaryMood: journal.primaryMood ?? "unknown",
      emotionTags: journal.emotionTags,
      topicTags: journal.topicTags,
    });
    updateMutation.reset();
    setIsEditing(true);
  }, [editForm, journal, updateMutation]);

  const exitEditMode = useCallback(() => {
    updateMutation.reset();
    setIsEditing(false);
  }, [updateMutation]);

  const submitEdit = useCallback(
    (values: JournalEditValues) => {
      if (!date) {
        return;
      }

      updateMutation.mutate(
        {
          date,
          payload: {
            title: values.title,
            summary: values.summary,
            primaryMood: values.primaryMood,
            emotionTags: values.emotionTags,
            topicTags: values.topicTags,
          },
        },
        {
          onSuccess: () => {
            toast.success("Reflection updated.");
            setIsEditing(false);
          },
          onError: () => {
            toast.error("Couldn’t save your changes.", {
              description: "Your edits weren’t saved. Try again in a moment.",
            });
          },
        },
      );
    },
    [date, updateMutation],
  );

  const saveEdit = useCallback(() => {
    void editForm.handleSubmit(submitEdit)();
  }, [editForm, submitEdit]);

  return {
    date,
    editForm,
    enterEditMode,
    exitEditMode,
    isEditing,
    isSavingEdit: updateMutation.isPending,
    journalQuery,
    saveEdit,
    saveEditError: updateMutation.error,
  };
}
