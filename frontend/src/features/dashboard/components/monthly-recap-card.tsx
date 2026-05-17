import { ArrowRightIcon, Loader2Icon, SparklesIcon } from "lucide-react";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import type { MonthlyRecapCard as MonthlyRecapCardType } from "@/shared/types/mono";

type MonthlyRecapCardProps = {
  recap: MonthlyRecapCardType;
  isGenerating: boolean;
  hasError: boolean;
  onGenerate: () => void;
  onRetry: () => void;
};

export function MonthlyRecapCard({
  recap,
  isGenerating,
  hasError,
  onGenerate,
  onRetry,
}: MonthlyRecapCardProps) {
  if (recap.status === "generated") {
    return (
      <Card className="orb-panel bg-[var(--surface-glass-soft)]">
        <CardHeader>
          <Badge variant="secondary">Monthly recap</Badge>
          <CardTitle>{recap.title}</CardTitle>
          <CardDescription>{recap.summaryPreview}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-[1.2rem] border border-border/70 bg-background/80 px-4 py-3">
            <div>
              <p className="eyebrow">Most frequent mood</p>
              <p className="mt-2 text-sm text-card-foreground">
                {recap.moodEmoji} {recap.mostFrequentMood}
              </p>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>{recap.journalCount} journals</p>
              <p>Generated for this month</p>
            </div>
          </div>
          <Button asChild size="sm" className="w-fit">
            <Link href={`/recaps/${recap.month}`}>
              View recap
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (recap.status === "ready_to_generate") {
    return (
      <Card className="bg-[var(--surface-glass-soft)]">
        <CardHeader>
          <Badge variant="secondary">Monthly recap</Badge>
          <CardTitle>Your month has enough material to summarize.</CardTitle>
          <CardDescription>
            {recap.journalCount} reflections are ready. Generate a gentle
            monthly reflection from your journals.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            size="sm"
            className="w-fit"
            onClick={onGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Generating
              </>
            ) : (
              <>
                Generate monthly recap
                <ArrowRightIcon data-icon="inline-end" />
              </>
            )}
          </Button>
          {hasError ? (
            <Alert variant="destructive">
              <AlertTitle>Couldn’t generate the recap.</AlertTitle>
              <AlertDescription>
                Your journals are safe. Try again when you’re ready.
              </AlertDescription>
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRetry}
                  disabled={isGenerating}
                >
                  Retry
                </Button>
              </div>
            </Alert>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[var(--surface-glass-soft)]">
      <CardHeader>
        <Badge variant="secondary">Monthly recap</Badge>
        <CardTitle>More entries will unlock a fuller monthly view.</CardTitle>
        <CardDescription>
          You need at least {recap.minimumRequired ?? 3} summarized or edited
          journals before the recap becomes available.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-3 text-sm text-muted-foreground">
        <SparklesIcon className="size-4" />
        <span>{recap.journalCount} journal entries counted so far.</span>
      </CardContent>
    </Card>
  );
}
