import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type DashboardCalendarSectionProps = {
  children: ReactNode;
  monthLabel: string;
  onNextMonth: () => void;
  onPreviousMonth: () => void;
};

export function DashboardCalendarSection({
  children,
  monthLabel,
  onNextMonth,
  onPreviousMonth,
}: DashboardCalendarSectionProps) {
  return (
    <Card className="bg-[var(--surface-glass-soft)]">
      <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Calendar</p>
          <CardTitle className="mt-3">{monthLabel}</CardTitle>
          <CardDescription>
            Open past journals, continue today, and spot the rhythm of recent
            moods.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-lg"
            aria-label="Go to previous month"
            onClick={onPreviousMonth}
          >
            <ArrowLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-lg"
            aria-label="Go to next month"
            onClick={onNextMonth}
          >
            <ArrowRightIcon />
          </Button>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
