"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { MoodPicker } from "@/features/journal-chat/components/mood-picker";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
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
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Textarea } from "@/shared/components/ui/textarea";
import { formatLongDate, getTodayDateKey } from "@/shared/lib/date";
import { moodMeta } from "@/shared/lib/moods";
import { useCurrentUserQuery } from "@/shared/repository/auth/query";
import {
  useSendChatMessageMutation,
  useTodayChatQuery,
} from "@/shared/repository/chat/query";
import { useSummarizeTodayJournalMutation } from "@/shared/repository/journals/query";
import type { Mood } from "@/shared/types/mono";

function buildInitialMoodMessage(mood: Mood) {
  return `I feel ${mood} today.`;
}

export function JournalChatContainer() {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [offerDismissed, setOfferDismissed] = useState(false);

  const userQuery = useCurrentUserQuery();
  const todayChatQuery = useTodayChatQuery();
  const sendMessageMutation = useSendChatMessageMutation();
  const summarizeMutation = useSummarizeTodayJournalMutation();

  const chat = todayChatQuery.data;

  useEffect(() => {
    if (
      chat?.journalState.status === "summarized" ||
      chat?.journalState.status === "edited"
    ) {
      router.replace(`/journal/${chat.date}`);
    }
  }, [chat?.date, chat?.journalState.status, router]);

  const handleMoodSelect = (mood: Mood) => {
    if (chat?.initialMood || sendMessageMutation.isPending) {
      return;
    }

    setOfferDismissed(false);
    sendMessageMutation.mutate({
      content: buildInitialMoodMessage(mood),
      initialMood: mood,
    });
  };

  const handleSend = () => {
    const content = draft.trim();

    if (!content) {
      return;
    }

    setOfferDismissed(false);
    sendMessageMutation.mutate(
      { content },
      {
        onSuccess: () => {
          setDraft("");
        },
      },
    );
  };

  const handleSummarize = () => {
    summarizeMutation.mutate(undefined, {
      onSuccess: (journal) => {
        router.push(`/journal/${journal.date}`);
      },
    });
  };

  const isBusy =
    todayChatQuery.isLoading ||
    sendMessageMutation.isPending ||
    summarizeMutation.isPending;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-8 md:px-10 lg:px-14">
      <header className="flex items-center justify-between border-b border-border/70 pb-6">
        <div>
          <p className="eyebrow">Guided journal</p>
          <h1 className="display-lg mt-3">A calmer way into today.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Start from mood, let Mono ask the next small question, then
            summarize only when the conversation has enough texture.
          </p>
        </div>
        <Button asChild variant="ghost">
          <Link href="/dashboard">
            <ArrowLeftIcon data-icon="inline-start" />
            Back to dashboard
          </Link>
        </Button>
      </header>

      <section className="grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
        <Card className="bg-[rgb(255_255_255_/_0.84)]">
          <CardHeader>
            <Badge variant="secondary">Today</Badge>
            <CardTitle>{formatLongDate(getTodayDateKey())}</CardTitle>
            <CardDescription>
              Pick the feeling that fits best. Mono will respond with one gentle
              reflection prompt at a time.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {todayChatQuery.isLoading ? (
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 8 }, (_, index) => (
                  <Skeleton
                    key={`mood-skeleton-${index + 1}`}
                    className="h-24 rounded-[1.25rem]"
                  />
                ))}
              </div>
            ) : (
              <MoodPicker
                value={chat?.initialMood ?? null}
                onSelect={handleMoodSelect}
                disabled={Boolean(chat?.initialMood) || isBusy}
              />
            )}

            <div className="rounded-[1.25rem] border border-border/80 bg-background/80 p-4">
              <p className="eyebrow">Current state</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Badge>
                  {chat?.initialMood
                    ? moodMeta[chat.initialMood].label
                    : "No mood selected yet"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {chat?.journalState.userMessageCount ?? 0} user messages
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {chat?.actions.canSummarize
                  ? "You already have enough context to summarize when you feel ready."
                  : "Write a little more before summarizing. Mono will unlock summary after three user messages."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[rgb(255_255_255_/_0.86)]">
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
            <CardDescription>
              Short, warm prompts. No diagnosis. No pressure to say everything
              at once.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex min-h-[25rem] flex-col gap-4 rounded-[1.25rem] border border-border/80 bg-background/70 p-4">
              {todayChatQuery.isLoading ? (
                Array.from({ length: 4 }, (_, index) => (
                  <Skeleton
                    key={`chat-skeleton-${index + 1}`}
                    className="h-20 rounded-[1.25rem]"
                  />
                ))
              ) : chat?.messages.length ? (
                chat.messages.map((message) => {
                  const isAssistant = message.role === "assistant";

                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${isAssistant ? "" : "flex-row-reverse"}`}
                    >
                      <Avatar className="mt-1 size-10">
                        {isAssistant && (
                          <AvatarImage
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
                            alt="Mono"
                          />
                        )}
                        <AvatarFallback>
                          {isAssistant
                            ? "MO"
                            : (userQuery.data?.name.slice(0, 2).toUpperCase() ??
                              "YO")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`max-w-[85%] rounded-[1.35rem] px-4 py-3 text-sm leading-relaxed ${
                          isAssistant
                            ? "bg-card text-card-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-1 items-center justify-center text-center text-sm leading-relaxed text-muted-foreground">
                  Choose your mood to begin. Mono will ask the first question
                  for you.
                </div>
              )}
            </div>

            {chat?.actions.shouldOfferSummary && !offerDismissed && (
              <Card size="sm" className="bg-[rgb(255_255_255_/_0.72)]">
                <CardHeader>
                  <CardTitle>There’s enough here to summarize.</CardTitle>
                  <CardDescription>
                    You can end here and turn the conversation into a structured
                    journal entry, or keep journaling a little longer.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    onClick={handleSummarize}
                    disabled={summarizeMutation.isPending}
                  >
                    End &amp; summarize
                    <ArrowRightIcon data-icon="inline-end" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setOfferDismissed(true)}
                  >
                    Keep journaling
                  </Button>
                </CardContent>
              </Card>
            )}

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="journal-message">
                  What feels most true right now?
                </FieldLabel>
                <Textarea
                  id="journal-message"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Write a little more about what happened, what stayed with you, or what feels unfinished."
                  disabled={!chat?.initialMood || isBusy}
                />
                <FieldDescription>
                  Mono responds after each message with one short reflective
                  question.
                </FieldDescription>
              </Field>
            </FieldGroup>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {chat?.actions.canSummarize
                  ? "You can summarize now or keep going."
                  : "Summary unlocks after three user messages."}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleSummarize}
                  disabled={
                    !chat?.actions.canSummarize || summarizeMutation.isPending
                  }
                >
                  End &amp; summarize
                </Button>
                <Button
                  onClick={handleSend}
                  disabled={!chat?.initialMood || !draft.trim() || isBusy}
                >
                  Send reflection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
