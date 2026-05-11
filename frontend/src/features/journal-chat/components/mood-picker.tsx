"use client";

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/shared/components/ui/toggle-group";
import { moodMeta } from "@/shared/lib/moods";
import { type Mood, moods } from "@/shared/types/mono";

export function MoodPicker({
  value,
  onSelect,
  disabled,
}: {
  value: Mood | null;
  onSelect: (mood: Mood) => void;
  disabled?: boolean;
}) {
  return (
    <ToggleGroup
      type="single"
      value={value ?? undefined}
      onValueChange={(nextValue) => {
        if (nextValue) {
          onSelect(nextValue as Mood);
        }
      }}
      spacing={2}
      className="grid w-full grid-cols-2 gap-3 md:grid-cols-4"
      disabled={disabled}
    >
      {moods.map((mood) => (
        <ToggleGroupItem
          key={mood}
          value={mood}
          variant="outline"
          className="h-auto min-w-0 flex-col items-start gap-3 rounded-[1.25rem] bg-card/80 px-4 py-4 text-left"
        >
          <span className="text-2xl">{moodMeta[mood].emoji}</span>
          <span className="flex flex-col items-start gap-1">
            <span className="text-sm text-card-foreground">
              {moodMeta[mood].label}
            </span>
            <span className="text-xs text-muted-foreground">
              {moodMeta[mood].tone}
            </span>
          </span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
