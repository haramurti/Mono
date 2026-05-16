import { formatMonthLabel } from "@/shared/lib/date";
import { getMoodEmoji, moodMeta } from "@/shared/lib/moods";
import type { MonthlyRecap, Mood } from "@/shared/types/mono";

export type MoodDistributionRow = {
  mood: Mood;
  emoji: string;
  label: string;
  count: number;
  percentage: number;
};

export function getRecapMonthLabel(month: string) {
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return "";
  }

  return formatMonthLabel(month);
}

export function formatTagLabel(tag: string) {
  return tag.replaceAll("_", " ");
}

export function getMostFrequentMoodLabel(recap: MonthlyRecap) {
  const emoji = getMoodEmoji(recap.mostFrequentMood);
  const meta = moodMeta[recap.mostFrequentMood];

  return `${emoji} ${meta?.label ?? recap.mostFrequentMood}`;
}

export function getMoodDistributionRows(
  recap: MonthlyRecap,
): MoodDistributionRow[] {
  const total = Object.values(recap.moodDistribution).reduce<number>(
    (accumulator, value) => accumulator + (value ?? 0),
    0,
  );

  if (total <= 0) {
    return [];
  }

  return Object.entries(recap.moodDistribution)
    .filter(([, count]) => typeof count === "number" && count > 0)
    .map(([mood, count]) => {
      const typedMood = mood as Mood;
      const safeCount = count ?? 0;
      return {
        mood: typedMood,
        emoji: getMoodEmoji(typedMood),
        label: moodMeta[typedMood]?.label ?? typedMood,
        count: safeCount,
        percentage: Math.round((safeCount / total) * 100),
      };
    })
    .sort((left, right) => right.count - left.count);
}
