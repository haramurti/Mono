import { z } from "zod";

import { emotionTags, moods, topicTags } from "@/shared/types/mono";

export const journalEditSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  summary: z.string().trim().min(1, "Summary is required."),
  primaryMood: z.enum(moods),
  emotionTags: z.array(z.enum(emotionTags)),
  topicTags: z.array(z.enum(topicTags)),
});

export type JournalEditValues = z.infer<typeof journalEditSchema>;
