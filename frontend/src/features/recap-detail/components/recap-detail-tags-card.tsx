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
        {tags.length ? (
          tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))
        ) : (
          <span className="text-xs text-muted-foreground">
            Nothing stood out yet.
          </span>
        )}
      </div>
    </div>
  );
}

type RecapDetailTagsCardProps = {
  topEmotionTags: string[];
  topTopicTags: string[];
};

export function RecapDetailTagsCard({
  topEmotionTags,
  topTopicTags,
}: RecapDetailTagsCardProps) {
  return (
    <Card className="bg-[var(--surface-glass-soft)]">
      <CardHeader>
        <CardTitle>Top tags</CardTitle>
        <CardDescription>
          The emotions and topics that recurred most across this month.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <TagPanel label="Top emotion tags" tags={topEmotionTags} />
        <TagPanel label="Top topic tags" tags={topTopicTags} />
      </CardContent>
    </Card>
  );
}
