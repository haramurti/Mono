import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import AppLogo from "@/shared/components/app/app-logo";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

const guidedSteps = [
  {
    id: "01",
    title: "Name the feeling first",
    description:
      "You do not have to explain everything at once. Pick the feeling that is closest to the surface.",
  },
  {
    id: "02",
    title: "Stay with one prompt",
    description:
      "Mono follows with one calm question, so the page never turns back into a blank one.",
  },
  {
    id: "03",
    title: "Leave with something shaped",
    description:
      "When the reflection is done, the entry becomes a journal you can revisit without re-reading the whole conversation.",
  },
];

const moodChips = ["Tired", "Unsettled", "Hopeful"];

const reflectionNotes = [
  "Mood comes first, writing comes second.",
  "Short prompts keep the pace calm.",
  "The summary keeps what mattered.",
];

export function LandingPage() {
  return (
    <main className="min-h-screen bg-background px-5 py-5 md:px-8 md:py-7">
      <div className="mx-auto w-full rounded-[2rem] border border-border/80 bg-[var(--surface-glass)] p-4 shadow-sm md:p-6">
        <header className="border-b border-border/70 pb-5 md:pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="flex items-center gap-3">
              <AppLogo className="size-9" />
              <span className="text-sm font-semibold tracking-tight">Mono</span>
            </Link>

            <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
              <a href="#how-it-works" className="hover:text-foreground">
                How it works
              </a>
              <a href="#preview" className="hover:text-foreground">
                Preview
              </a>
            </nav>

            <div className="flex items-center gap-2 text-sm sm:gap-3">
              <Link
                href="/login"
                className="inline-flex h-10 items-center rounded-full px-3 py-2 text-muted-foreground transition-colors hover:bg-background/60 hover:text-foreground"
              >
                Login
              </Link>
              <Button asChild size="sm">
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          </div>

          <div className="mt-5 flex gap-2 md:hidden">
            <a
              href="#how-it-works"
              className="inline-flex h-10 items-center rounded-full border border-border/80 bg-background/70 px-4 text-sm text-muted-foreground"
            >
              How it works
            </a>
            <a
              href="#preview"
              className="inline-flex h-10 items-center rounded-full border border-border/80 bg-background/70 px-4 text-sm text-muted-foreground"
            >
              Preview
            </a>
          </div>
        </header>

        <section className="relative overflow-hidden py-12 md:py-18">
          <div className="absolute inset-x-[22%] top-10 -z-10 h-28 rounded-full bg-secondary/25 blur-2xl" />
          <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
            <div className="flex flex-col justify-between gap-10">
              <div>
                <Badge variant="secondary">Guided daily journaling</Badge>

                <h1 className="display-xl mt-6 max-w-2xl text-balance">
                  Start with the feeling, not with the pressure to explain
                  everything.
                </h1>

                <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground">
                  Mono helps you begin gently, stay with one clear prompt, and
                  leave with a reflection that feels settled enough to keep.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/login">
                    Start reflection
                    <ArrowRightIcon data-icon="inline-end" />
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg">
                  <a href="#preview">See the flow</a>
                </Button>
              </div>

              <div className="rounded-[1.5rem] border border-border/75 bg-background/82 p-5 md:p-6">
                <p className="eyebrow">What changes</p>
                <p className="mt-3 max-w-2xl text-base leading-8 text-foreground/88">
                  Journaling should feel like being met where you are, not being
                  asked to perform clarity on demand. No blank page, no long
                  setup, no pressure to get it right on the first sentence.
                </p>
              </div>
            </div>

            <div className="grid gap-5">
              <div className="rounded-[1.75rem] border border-border/80 bg-[var(--surface-glass-soft)] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow">Tonight&apos;s entry</p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                      Evening check-in
                    </h2>
                  </div>

                  <span className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
                    3 min
                  </span>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {moodChips.map((mood) => (
                    <span
                      key={mood}
                      className="rounded-full border border-border/80 bg-background/75 px-3 py-1.5 text-sm text-muted-foreground"
                    >
                      {mood}
                    </span>
                  ))}
                </div>

                <div className="mt-7 grid gap-4 md:grid-cols-[0.72fr_1fr]">
                  <div className="rounded-[1.35rem] bg-secondary/30 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Mono asks
                    </p>
                    <p className="mt-3 text-sm leading-7 text-foreground/85">
                      What part of today stayed with you after everything else
                      moved on?
                    </p>
                  </div>

                  <div className="rounded-[1.35rem] border border-border/80 bg-card/80 p-4">
                    <p className="text-sm leading-7 text-muted-foreground">
                      I kept thinking about how scattered the day felt. It was
                      not dramatic, just a quiet accumulation of unfinished
                      things that never really let go.
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-4">
                      <span className="text-xs text-muted-foreground">
                        Continue when you are ready
                      </span>
                      <Button size="icon-sm" aria-label="Continue journaling">
                        <ArrowRightIcon />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.25rem] bg-background/55 px-4 py-3 text-sm text-muted-foreground">
                <p className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                  {reflectionNotes.map((note, index) => (
                    <span key={note} className="flex items-center gap-3">
                      {index > 0 ? (
                        <span
                          aria-hidden="true"
                          className="hidden size-1.5 rounded-full bg-muted-foreground/40 sm:block"
                        />
                      ) : null}
                      <span>{note}</span>
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-t border-border/70 pt-12 md:pt-16"
        >
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
            <div>
              <p className="eyebrow">How it works</p>
              <h2 className="display-md mt-4 max-w-md text-balance">
                A calmer path from feeling something to understanding it.
              </h2>
            </div>

            <div className="space-y-5">
              {guidedSteps.map((step) => (
                <div
                  key={step.id}
                  className="grid gap-3 rounded-[1.5rem] border border-border/75 bg-card/60 p-5 md:grid-cols-[4.5rem_1fr] md:gap-4 md:p-6"
                >
                  <div className="text-sm font-semibold tracking-[0.18em] text-muted-foreground">
                    {step.id}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 max-w-2xl text-sm leading-7 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="preview" className="mt-12 md:mt-16">
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
            <Card className="overflow-hidden bg-background/90">
              <CardContent className="p-5 md:p-6">
                <Badge variant="secondary">Reflection ready</Badge>

                <h2 className="display-md mt-5 max-w-md text-balance">
                  Keep the raw entry, leave with the part you need to remember.
                </h2>

                <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
                  Mono keeps the original conversation, then shapes it into a
                  summary you can return to later without sorting through every
                  sentence again.
                </p>

                <div className="mt-9 space-y-3">
                  <div className="rounded-[1rem] border border-border/80 bg-background/80 p-4">
                    <p className="text-sm font-medium">What stood out</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      You were not only tired. You were carrying several small
                      unresolved things at once.
                    </p>
                  </div>

                  <div className="rounded-[1rem] border border-border/80 bg-background/80 p-4">
                    <p className="text-sm font-medium">Pattern to notice</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      The day felt heavier when nothing had a clear stopping
                      point.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col justify-between gap-8 rounded-[1.75rem] border border-border/80 bg-secondary/20 p-5 md:p-6">
              <div>
                <p className="eyebrow">Why it helps</p>
                <h2 className="display-md mt-4 max-w-lg text-balance">
                  Reflection becomes easier when the next step is always clear.
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.2rem] bg-background/60 p-4">
                  <p className="text-sm font-medium text-foreground">
                    One prompt at a time
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    You are never asked to organize the whole day in one go.
                  </p>
                </div>

                <div className="rounded-[1.2rem] bg-background/60 p-4">
                  <p className="text-sm font-medium text-foreground">
                    A record worth revisiting
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    The journal keeps both the feeling and the shape it became.
                  </p>
                </div>
              </div>

              <div className="rounded-[1.35rem] border border-border/80 bg-background/85 p-6">
                <p className="max-w-xl text-base leading-8 text-foreground/85">
                  Mono is for the moment when you know something about the day
                  is still sitting with you, but you do not want to wrestle a
                  blank page to figure out what it is.
                </p>

                <Button asChild size="lg" className="mt-6 w-fit">
                  <Link href="/login">
                    Start reflection
                    <ArrowRightIcon data-icon="inline-end" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
