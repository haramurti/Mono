import { formatLongDate } from "@/shared/lib/date";
import { getMoodEmoji } from "@/shared/lib/moods";
import type { Journal } from "@/shared/types/mono";

export function formatTagLabel(tag: string) {
  return tag.replaceAll("_", " ");
}

export function getFormattedDate(date: string | undefined) {
  return date ? formatLongDate(date) : undefined;
}

export function getMoodBadgeLabel(primaryMood: Journal["primaryMood"]) {
  return primaryMood
    ? `${getMoodEmoji(primaryMood)} ${primaryMood}`
    : undefined;
}

export function getMoodIntensityLabel(
  moodIntensity: number | null | undefined,
) {
  return moodIntensity ? `${moodIntensity}/5` : "—/5";
}

export function hasRenderableJournal(journal: Journal | undefined) {
  return Boolean(journal);
}
