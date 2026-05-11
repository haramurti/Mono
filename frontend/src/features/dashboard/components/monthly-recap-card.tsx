import { ArrowRightIcon, SparklesIcon } from "lucide-react";

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

export function MonthlyRecapCard({ recap }: { recap: MonthlyRecapCardType }) {
  if (recap.status === "generated") {
    return (
      <Card className="orb-panel bg-[rgb(255_255_255_/_0.84)]">
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
          <Button variant="outline" className="justify-between" disabled>
            View recap
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (recap.status === "ready_to_generate") {
    return (
      <Card className="bg-[rgb(255_255_255_/_0.82)]">
        <CardHeader>
          <Badge variant="secondary">Monthly recap</Badge>
          <CardTitle>Your month has enough material to summarize.</CardTitle>
          <CardDescription>
            {recap.journalCount} reflections are ready. Recap generation is
            planned next, but the card state is already wired to the same
            contract.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" disabled>
            Generate monthly recap
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[rgb(255_255_255_/_0.82)]">
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
