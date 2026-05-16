import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

function SummaryPanel({
  body,
  title,
}: {
  body: string | null | undefined;
  title: string;
}) {
  return (
    <div className="rounded-[1.2rem] border border-border/70 bg-background/70 p-5">
      <p className="eyebrow">{title}</p>
      <p className="mt-4 text-sm leading-7 text-card-foreground">{body}</p>
    </div>
  );
}

export function JournalDetailSummaryCard({
  keyInsight,
  suggestedNextAction,
  summary,
}: {
  keyInsight: string | null | undefined;
  suggestedNextAction: string | null | undefined;
  summary: string | null | undefined;
}) {
  return (
    <Card className="bg-[var(--surface-glass-soft)]">
      <CardHeader>
        <CardTitle>Summary</CardTitle>
        <CardDescription>
          A first-person reflection generated from the guided conversation.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <SummaryPanel title="Daily reflection" body={summary} />
        <div className="grid gap-4">
          <SummaryPanel title="Key insight" body={keyInsight} />
          <SummaryPanel
            title="Suggested next action"
            body={suggestedNextAction}
          />
        </div>
      </CardContent>
    </Card>
  );
}
