import { ArrowRightIcon, HeartHandshakeIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

const featureHighlights = [
  {
    title: "Start from a feeling",
    description:
      "A mood picker helps the first step feel smaller when a blank page feels too sharp.",
  },
  {
    title: "Reflect with gentle prompts",
    description:
      "Mono replies with one calm question at a time, so the conversation never turns into pressure.",
  },
  {
    title: "Return to patterns over time",
    description:
      "Your dashboard turns scattered days into a quieter view of mood, rhythm, and change.",
  },
];

export function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 mx-auto h-[34rem] max-w-7xl">
        <div className="absolute left-0 top-8 size-64 rounded-full bg-[radial-gradient(circle,var(--gradient-mint),transparent_70%)] blur-3xl" />
        <div className="absolute right-0 top-0 size-80 rounded-full bg-[radial-gradient(circle,var(--gradient-peach),transparent_70%)] blur-3xl" />
        <div className="absolute right-32 top-48 size-72 rounded-full bg-[radial-gradient(circle,var(--gradient-lavender),transparent_70%)] blur-3xl" />
      </div>

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-20 pt-8 md:px-10 lg:px-14">
        <header className="flex items-center justify-between border-b border-border/70 pb-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary text-center text-lg leading-10 text-primary-foreground">
              M
            </div>
            <div>
              <p className="eyebrow">Mono</p>
              <p className="text-sm text-muted-foreground">
                AI-guided journaling for quieter reflection
              </p>
            </div>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/api/demo-login">
              Journal now
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </header>

        <div className="grid flex-1 gap-14 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="flex flex-col gap-8">
            <Badge>Calm companion for your thoughts</Badge>
            <div className="flex flex-col gap-6">
              <h1 className="display-mega max-w-4xl text-balance">
                Start with a feeling.
                <br />
                Mono guides the rest.
              </h1>
              <p className="body-copy max-w-2xl text-balance">
                When journaling feels too blank to begin, Mono helps you name
                the day gently, reflect through a short guided conversation, and
                leave with a journal entry that sounds like you.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/api/demo-login">
                  Enter the demo
                  <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#how-it-works">See how Mono helps</Link>
              </Button>
            </div>
            <div className="grid gap-5 text-sm text-muted-foreground sm:grid-cols-3">
              <div>
                <p className="eyebrow">For the blank-page moment</p>
                <p className="mt-2 leading-relaxed">
                  Start from mood instead of forcing the perfect first sentence.
                </p>
              </div>
              <div>
                <p className="eyebrow">For daily clarity</p>
                <p className="mt-2 leading-relaxed">
                  Let one calm question at a time turn noise into reflection.
                </p>
              </div>
              <div>
                <p className="eyebrow">For patterns over time</p>
                <p className="mt-2 leading-relaxed">
                  Revisit mood history and notice how the month has been moving.
                </p>
              </div>
            </div>
          </div>

          <Card className="orb-panel border-border/70 bg-[rgb(255_255_255_/_0.82)] backdrop-blur">
            <CardHeader>
              <Badge variant="secondary">Guided reflection</Badge>
              <CardTitle>
                Today doesn’t have to start with a blank text box.
              </CardTitle>
              <CardDescription>
                Mono begins with the emotional signal, then asks one short
                follow-up at a time until the shape of the day becomes clearer.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="rounded-[1.25rem] border border-border/80 bg-background/80 p-5">
                <p className="eyebrow">Mood prompt</p>
                <p className="mt-3 text-2xl">😴 Tired</p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  “Thank you for starting from that feeling. What part of today
                  has felt the heaviest?”
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-border/80 bg-card p-5">
                <p className="eyebrow">Daily reflection output</p>
                <p className="mt-4 text-sm leading-relaxed text-card-foreground">
                  “Today I felt mentally tired because there were many things on
                  my mind. I realized I’ve been asking myself to carry too much
                  at once, and what I need most is a smaller, kinder pace.”
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-20 md:px-10 lg:px-14"
      >
        <div className="max-w-2xl">
          <p className="eyebrow">Why Mono exists</p>
          <h2 className="display-xl mt-4 text-balance">
            Journaling often fails before it begins.
          </h2>
          <p className="body-copy mt-5 text-balance">
            The friction is rarely about writing skill. It is usually about not
            knowing where to enter the day. Mono lowers that barrier with mood,
            conversation, and a calmer path into self-reflection.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {featureHighlights.map((feature) => (
            <Card key={feature.title} size="sm" className="bg-card/85">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-20 md:px-10 lg:px-14">
        <Separator />
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="max-w-xl">
            <p className="eyebrow">How Mono helps</p>
            <h2 className="display-lg mt-4 text-balance">
              Less pressure, more signal.
            </h2>
          </div>
          <div className="grid gap-4">
            <Card size="sm" className="bg-card/80">
              <CardHeader>
                <CardTitle>Pick a mood before you write</CardTitle>
                <CardDescription>
                  A feeling is easier to reach for than a perfect opening line.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card size="sm" className="bg-card/80">
              <CardHeader>
                <CardTitle>Let Mono ask the next small question</CardTitle>
                <CardDescription>
                  Responses stay short, warm, and non-judgmental so the flow
                  stays reflective instead of clinical.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card size="sm" className="bg-card/80">
              <CardHeader>
                <CardTitle>Return to the month with context</CardTitle>
                <CardDescription>
                  Dashboard history makes it easier to notice rhythm,
                  repetition, and the emotional weather of your days.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-20 md:px-10 lg:px-14">
        <Alert className="bg-card/85">
          <HeartHandshakeIcon />
          <AlertTitle>Gentle support, not therapy</AlertTitle>
          <AlertDescription>
            Mono is a wellbeing companion for reflection and journaling. It is
            not a clinical tool, and it should not replace professional mental
            health support.
          </AlertDescription>
        </Alert>

        <Card className="orb-panel border-border/70 bg-[rgb(255_255_255_/_0.78)]">
          <CardHeader>
            <Badge variant="secondary">Ready for the demo</Badge>
            <CardTitle>From blank thoughts to clear reflection.</CardTitle>
            <CardDescription>
              The demo includes seeded journal history, a working guided chat,
              and a calm dashboard for revisiting mood over time.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <SparklesIcon className="size-4" />
              Mood picker, AI-guided prompts, summary generation, and calendar
              history.
            </div>
            <Button asChild size="lg">
              <Link href="/api/demo-login">
                Journal now
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
