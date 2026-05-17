import type { Mood } from "@/shared/types/mono";

export const moodMeta: Record<
  Mood,
  {
    emoji: string;
    label: string;
    tone: string;
    surfaceClass: string;
  }
> = {
  happy: {
    emoji: "😊",
    label: "Happy",
    tone: "Light",
    surfaceClass: "bg-[var(--mood-happy-surface)]",
  },
  calm: {
    emoji: "😌",
    label: "Calm",
    tone: "Steady",
    surfaceClass: "bg-[var(--mood-calm-surface)]",
  },
  sad: {
    emoji: "😢",
    label: "Sad",
    tone: "Heavy",
    surfaceClass: "bg-[var(--mood-sad-surface)]",
  },
  angry: {
    emoji: "😠",
    label: "Angry",
    tone: "Sharp",
    surfaceClass: "bg-[var(--mood-angry-surface)]",
  },
  anxious: {
    emoji: "😟",
    label: "Anxious",
    tone: "Restless",
    surfaceClass: "bg-[var(--mood-anxious-surface)]",
  },
  tired: {
    emoji: "😴",
    label: "Tired",
    tone: "Low",
    surfaceClass: "bg-[var(--mood-tired-surface)]",
  },
  confused: {
    emoji: "😕",
    label: "Confused",
    tone: "Foggy",
    surfaceClass: "bg-[var(--mood-confused-surface)]",
  },
  unknown: {
    emoji: "🌫️",
    label: "Unknown",
    tone: "Unclear",
    surfaceClass: "bg-[var(--mood-unknown-surface)]",
  },
};

export function getMoodEmoji(mood: Mood | null | undefined) {
  return mood ? moodMeta[mood].emoji : "•";
}
