import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type RecapDetailOverviewCardProps = {
  journalCount: number;
  monthLabel: string;
  mostFrequentMoodLabel: string;
  summary: string;
  title: string;
};

export function RecapDetailOverviewCard({
  journalCount,
  monthLabel,
  mostFrequentMoodLabel,
  summary,
  title,
}: RecapDetailOverviewCardProps) {
  return (
    <Card className="orb-panel bg-[var(--surface-glass-soft)]">
      <CardHeader>
        <Badge variant="secondary">Monthly recap</Badge>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{monthLabel}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-[1fr_auto]">
        <p className="text-sm leading-7 text-card-foreground">{summary}</p>
        <div className="flex flex-col items-end gap-2 rounded-[1.2rem] border border-border/70 bg-background/80 px-4 py-3 text-right">
          <p className="eyebrow">Most frequent mood</p>
          <p className="text-base text-card-foreground">
            {mostFrequentMoodLabel}
          </p>
          <p className="text-xs text-muted-foreground">
            {journalCount} journals this month
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
