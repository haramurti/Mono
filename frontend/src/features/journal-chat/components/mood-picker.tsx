"use client";

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/shared/components/ui/toggle-group";
import { moodMeta } from "@/shared/lib/moods";
import { cn } from "@/shared/lib/utils";
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
      className="grid w-full grid-cols-2 gap-3 md:grid-cols-4"
      disabled={disabled}
    >
      {moods.map((mood) => (
        <ToggleGroupItem
          key={mood}
          value={mood}
          variant="outline"
          className={cn(
            "h-auto min-w-0 flex-col items-start gap-3 rounded-[1rem] px-4 py-3 text-left",
            moodMeta[mood].surfaceClass,
          )}
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
