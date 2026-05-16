import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import type { MoodDistributionRow } from "@/features/recap-detail/lib/recap-detail-display";

type RecapDetailMoodDistributionCardProps = {
  rows: MoodDistributionRow[];
};

export function RecapDetailMoodDistributionCard({
  rows,
}: RecapDetailMoodDistributionCardProps) {
  return (
    <Card className="bg-[var(--surface-glass-soft)]">
      <CardHeader>
        <CardTitle>Mood distribution</CardTitle>
        <CardDescription>
          How your reflections were distributed across moods this month.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {rows.length ? (
          rows.map((row) => (
            <div
              key={row.mood}
              className="rounded-[1.2rem] border border-border/70 bg-background/80 p-4"
            >
              <div className="flex items-center justify-between gap-3 text-sm text-card-foreground">
                <span className="flex items-center gap-2">
                  <span className="text-base">{row.emoji}</span>
                  <span>{row.label}</span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {row.count} {row.count === 1 ? "entry" : "entries"} ·{" "}
                  {row.percentage}%
                </span>
              </div>
              <div
                className="mt-3 h-2 w-full rounded-full bg-secondary/60"
                aria-hidden="true"
              >
                <div
                  className="h-full rounded-full bg-primary/70"
                  style={{ width: `${row.percentage}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            Mood distribution will appear once entries are summarized.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
