import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

function ReflectionPanel({ body, title }: { body: string; title: string }) {
  return (
    <div className="rounded-[1.2rem] border border-border/70 bg-background/70 p-5">
      <p className="eyebrow">{title}</p>
      <p className="mt-4 text-sm leading-7 text-card-foreground">{body}</p>
    </div>
  );
}

type RecapDetailSummaryCardProps = {
  monthlyInsight: string;
  recurringPattern: string;
  suggestedFocusNextMonth: string;
};

export function RecapDetailSummaryCard({
  monthlyInsight,
  recurringPattern,
  suggestedFocusNextMonth,
}: RecapDetailSummaryCardProps) {
  return (
    <Card className="bg-[var(--surface-glass-soft)]">
      <CardHeader>
        <CardTitle>Reflection</CardTitle>
        <CardDescription>
          Patterns and gentle suggestions drawn from this month’s entries.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <ReflectionPanel title="Recurring pattern" body={recurringPattern} />
        <ReflectionPanel title="Monthly insight" body={monthlyInsight} />
        <ReflectionPanel
          title="Suggested focus next month"
          body={suggestedFocusNextMonth}
        />
      </CardContent>
    </Card>
  );
}
