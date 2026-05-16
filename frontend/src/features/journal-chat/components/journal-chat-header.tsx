import { ChevronDownIcon } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

type JournalChatHeaderProps = {
  dateLabel: string;
  isToolsSheetOpen: boolean;
  moodLabel: string;
  moodVariant: "outline" | "secondary";
  onOpenTools: () => void;
};

export function JournalChatHeader({
  dateLabel,
  isToolsSheetOpen,
  moodLabel,
  moodVariant,
  onOpenTools,
}: JournalChatHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-3 border-b border-border/60 pb-3">
      <div className="flex min-w-0 flex-wrap items-center gap-2 md:gap-3">
        <span className="rounded-full border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground/80">
          {dateLabel}
        </span>
        <Badge variant={moodVariant}>{moodLabel}</Badge>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onOpenTools}
        aria-haspopup="dialog"
        aria-expanded={isToolsSheetOpen}
        aria-controls="capture-tools-sheet"
      >
        Tools
        <ChevronDownIcon />
      </Button>
    </header>
  );
}
