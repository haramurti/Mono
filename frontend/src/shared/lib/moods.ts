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
    surfaceClass: "bg-[rgb(167_229_211_/_0.18)]",
  },
  calm: {
    emoji: "😌",
    label: "Calm",
    tone: "Steady",
    surfaceClass: "bg-[rgb(168_200_232_/_0.18)]",
  },
  sad: {
    emoji: "😢",
    label: "Sad",
    tone: "Heavy",
    surfaceClass: "bg-[rgb(200_184_224_/_0.18)]",
  },
  angry: {
    emoji: "😠",
    label: "Angry",
    tone: "Sharp",
    surfaceClass: "bg-[rgb(232_184_196_/_0.22)]",
  },
  anxious: {
    emoji: "😟",
    label: "Anxious",
    tone: "Restless",
    surfaceClass: "bg-[rgb(244_197_168_/_0.22)]",
  },
  tired: {
    emoji: "😴",
    label: "Tired",
    tone: "Low",
    surfaceClass: "bg-[rgb(168_200_232_/_0.14)]",
  },
  confused: {
    emoji: "😕",
    label: "Confused",
    tone: "Foggy",
    surfaceClass: "bg-[rgb(200_184_224_/_0.16)]",
  },
  unknown: {
    emoji: "🌫️",
    label: "Unknown",
    tone: "Unclear",
    surfaceClass: "bg-[rgb(240_239_237_/_0.95)]",
  },
};

export function getMoodEmoji(mood: Mood | null | undefined) {
  return mood ? moodMeta[mood].emoji : "•";
}
