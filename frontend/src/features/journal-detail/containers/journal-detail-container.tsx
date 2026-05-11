"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatLongDate } from "@/shared/lib/date";
import { getMoodEmoji } from "@/shared/lib/moods";
import { useJournalByDateQuery } from "@/shared/repository/journals/query";

export function JournalDetailContainer() {
  const params = useParams<{ date: string }>();
  const date = typeof params?.date === "string" ? params.date : "";
  const journalQuery = useJournalByDateQuery(date);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-8 md:px-10 lg:px-14">
      <header className="flex items-center justify-between border-b border-border/70 pb-6">
        <div>
          <p className="eyebrow">Journal detail</p>
          <h1 className="display-lg mt-3">
            A structured reflection from your day.
          </h1>
        </div>
        <Button asChild variant="ghost">
          <Link href="/dashboard">
            <ArrowLeftIcon data-icon="inline-start" />
            Back to dashboard
          </Link>
        </Button>
      </header>

      {journalQuery.isLoading ? (
        <div className="grid gap-5">
          <Skeleton className="h-64 rounded-[1.5rem]" />
          <Skeleton className="h-80 rounded-[1.5rem]" />
        </div>
      ) : journalQuery.isError || !journalQuery.data ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No journal found for this date.</EmptyTitle>
            <EmptyDescription>
              This date does not have a saved reflection yet.
            </EmptyDescription>
          </EmptyHeader>
          <Button asChild>
            <Link href="/dashboard">Return to dashboard</Link>
          </Button>
        </Empty>
      ) : (
        <>
          <Card className="orb-panel bg-[rgb(255_255_255_/_0.84)]">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-3">
                <Badge>
                  {getMoodEmoji(journalQuery.data.primaryMood)}{" "}
                  {journalQuery.data.primaryMood ?? "unknown"}
                </Badge>
                {journalQuery.data.isEdited && (
                  <Badge variant="outline">Edited</Badge>
                )}
              </div>
              <CardTitle>{journalQuery.data.title}</CardTitle>
              <CardDescription>
                {formatLongDate(journalQuery.data.date)}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.2rem] border border-border/70 bg-background/80 p-4">
                <p className="eyebrow">Mood intensity</p>
                <p className="mt-3 text-3xl text-card-foreground">
                  {journalQuery.data.moodIntensity ?? "—"}/5
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-border/70 bg-background/80 p-4">
                <p className="eyebrow">Emotion tags</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {journalQuery.data.emotionTags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag.replaceAll("_", " ")}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="rounded-[1.2rem] border border-border/70 bg-background/80 p-4">
                <p className="eyebrow">Topic tags</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {journalQuery.data.topicTags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag.replaceAll("_", " ")}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[rgb(255_255_255_/_0.86)]">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>
                A first-person reflection generated from the guided
                conversation.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[1.2rem] border border-border/70 bg-background/70 p-5">
                <p className="eyebrow">Daily reflection</p>
                <p className="mt-4 text-sm leading-7 text-card-foreground">
                  {journalQuery.data.summary}
                </p>
              </div>
              <div className="grid gap-4">
                <div className="rounded-[1.2rem] border border-border/70 bg-background/70 p-5">
                  <p className="eyebrow">Key insight</p>
                  <p className="mt-4 text-sm leading-7 text-card-foreground">
                    {journalQuery.data.keyInsight}
                  </p>
                </div>
                <div className="rounded-[1.2rem] border border-border/70 bg-background/70 p-5">
                  <p className="eyebrow">Suggested next action</p>
                  <p className="mt-4 text-sm leading-7 text-card-foreground">
                    {journalQuery.data.suggestedNextAction}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </main>
  );
}
