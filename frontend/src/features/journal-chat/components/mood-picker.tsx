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
      value={value ?? ""}
      onValueChange={(nextValue) => {
        if (nextValue) {
          onSelect(nextValue as Mood);
        }
      }}
      spacing={2}
      className="grid w-full grid-cols-4 gap-2"
      disabled={disabled}
    >
      {moods.map((mood) => (
        <ToggleGroupItem
          key={mood}
          value={mood}
          variant="outline"
          className="h-auto min-w-0 flex-col items-center gap-1.5 rounded-xl px-2 py-3 transition-transform duration-200 ease-out hover:-translate-y-0.5 data-[state=on]:-translate-y-0.5"
        >
          <span className="text-xl">{moodMeta[mood].emoji}</span>
          <span className="text-[11px] text-muted-foreground">
            {moodMeta[mood].label}
          </span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
