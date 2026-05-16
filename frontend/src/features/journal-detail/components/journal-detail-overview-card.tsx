import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

function TagPanel({ label, tags }: { label: string; tags: string[] }) {
  return (
    <div className="rounded-[1.2rem] border border-border/70 bg-background/80 p-4">
      <p className="eyebrow">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function JournalDetailOverviewCard({
  emotionTags,
  formattedDate,
  isEdited,
  moodBadgeLabel,
  moodIntensityLabel,
  title,
  topicTags,
}: {
  emotionTags: string[];
  formattedDate: string;
  isEdited: boolean;
  moodBadgeLabel: string;
  moodIntensityLabel: string;
  title: string;
  topicTags: string[];
}) {
  return (
    <Card className="orb-panel bg-[var(--surface-glass-soft)]">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-3">
          <Badge>{moodBadgeLabel}</Badge>
          {isEdited ? <Badge variant="outline">Edited</Badge> : null}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{formattedDate}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.2rem] border border-border/70 bg-background/80 p-4">
          <p className="eyebrow">Mood intensity</p>
          <p className="mt-3 text-3xl text-card-foreground">
            {moodIntensityLabel}
          </p>
        </div>
        <TagPanel label="Emotion tags" tags={emotionTags} />
        <TagPanel label="Topic tags" tags={topicTags} />
      </CardContent>
    </Card>
  );
}
