"use client";

import { Loader2Icon } from "lucide-react";
import { Controller, type UseFormReturn } from "react-hook-form";

import { formatTagLabel } from "@/features/journal-detail/lib/journal-detail-display";
import type { JournalEditValues } from "@/features/journal-detail/schemas/journal-edit-schema";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/shared/components/ui/toggle-group";
import { moodMeta } from "@/shared/lib/moods";
import { cn } from "@/shared/lib/utils";
import {
  emotionTags,
  type Mood,
  moods,
  topicTags,
} from "@/shared/types/mono";

type JournalDetailEditFormProps = {
  form: UseFormReturn<JournalEditValues>;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

function FieldLabel({
  description,
  htmlFor,
  label,
}: {
  description?: string;
  htmlFor?: string;
  label: string;
}) {
  return (
    <div className="grid gap-1">
      <label className="eyebrow" htmlFor={htmlFor}>
        {label}
      </label>
      {description ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p role="alert" className="text-xs text-destructive">
      {message}
    </p>
  );
}

export function JournalDetailEditForm({
  form,
  isSubmitting,
  onCancel,
  onSubmit,
}: JournalDetailEditFormProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = form;

  return (
    <Card className="bg-[var(--surface-glass-soft)]">
      <CardHeader>
        <CardTitle>Edit reflection</CardTitle>
        <CardDescription>
          Adjust the title, summary, mood, and tags. Saving marks this entry as
          edited.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-6"
          onSubmit={handleSubmit(onSubmit)}
          aria-busy={isSubmitting}
        >
          <div className="grid gap-2">
            <FieldLabel htmlFor="journal-edit-title" label="Title" />
            <Input
              id="journal-edit-title"
              autoComplete="off"
              aria-invalid={Boolean(errors.title)}
              {...register("title")}
            />
            <FieldError message={errors.title?.message} />
          </div>

          <div className="grid gap-2">
            <FieldLabel htmlFor="journal-edit-summary" label="Summary" />
            <Textarea
              id="journal-edit-summary"
              className="min-h-32"
              aria-invalid={Boolean(errors.summary)}
              {...register("summary")}
            />
            <FieldError message={errors.summary?.message} />
          </div>

          <div className="grid gap-3">
            <FieldLabel
              label="Primary mood"
              description="Choose the mood that best describes this reflection."
            />
            <Controller
              control={control}
              name="primaryMood"
              render={({ field }) => (
                <ToggleGroup
                  type="single"
                  value={field.value}
                  onValueChange={(next) => {
                    if (next) {
                      field.onChange(next as Mood);
                    }
                  }}
                  spacing={2}
                  className="grid w-full grid-cols-2 gap-3 md:grid-cols-4"
                >
                  {moods.map((mood) => (
                    <ToggleGroupItem
                      key={mood}
                      value={mood}
                      variant="outline"
                      className={cn(
                        "h-auto min-w-0 flex-col items-start gap-2 rounded-[1rem] px-4 py-3 text-left",
                        moodMeta[mood].surfaceClass,
                      )}
                    >
                      <span className="text-2xl">{moodMeta[mood].emoji}</span>
                      <span className="text-sm text-card-foreground">
                        {moodMeta[mood].label}
                      </span>
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              )}
            />
            <FieldError message={errors.primaryMood?.message} />
          </div>

          <div className="grid gap-3">
            <FieldLabel
              label="Emotion tags"
              description="Pick the emotions that best matched this entry."
            />
            <Controller
              control={control}
              name="emotionTags"
              render={({ field }) => (
                <ToggleGroup
                  type="multiple"
                  value={field.value}
                  onValueChange={(next) => field.onChange(next)}
                  spacing={2}
                  className="flex flex-wrap gap-2"
                >
                  {emotionTags.map((tag) => (
                    <ToggleGroupItem
                      key={tag}
                      value={tag}
                      variant="outline"
                      className="rounded-full px-3 py-1.5 text-xs"
                    >
                      {formatTagLabel(tag)}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              )}
            />
            <FieldError message={errors.emotionTags?.message} />
          </div>

          <div className="grid gap-3">
            <FieldLabel
              label="Topic tags"
              description="What was on your mind during this entry."
            />
            <Controller
              control={control}
              name="topicTags"
              render={({ field }) => (
                <ToggleGroup
                  type="multiple"
                  value={field.value}
                  onValueChange={(next) => field.onChange(next)}
                  spacing={2}
                  className="flex flex-wrap gap-2"
                >
                  {topicTags.map((tag) => (
                    <ToggleGroupItem
                      key={tag}
                      value={tag}
                      variant="outline"
                      className="rounded-full px-3 py-1.5 text-xs"
                    >
                      {formatTagLabel(tag)}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              )}
            />
            <FieldError message={errors.topicTags?.message} />
          </div>

          <div className="flex flex-col gap-2 border-t border-border/60 pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Saving
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
