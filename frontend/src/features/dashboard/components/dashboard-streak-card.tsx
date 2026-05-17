import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export function DashboardStreakCard({ streakLabel }: { streakLabel: string }) {
  return (
    <Card className="bg-[var(--surface-glass-soft)]">
      <CardHeader>
        <p className="eyebrow">Current streak</p>
        <CardTitle>{streakLabel}</CardTitle>
        <CardDescription>
          Consecutive days with a summarized or edited reflection.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm leading-relaxed text-muted-foreground">
        The streak is meant to feel supportive, not punitive. Missing a day does
        not erase the value of what you already noticed.
      </CardContent>
    </Card>
  );
}
