import { XIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

type JournalChatToolsSheetProps = {
  children: ReactNode;
  isOpen: boolean;
  moodLabel: string;
  summaryStateLabel: string;
  userMessageCount: number;
  onClose: () => void;
};

export function JournalChatToolsSheet({
  children,
  isOpen,
  moodLabel,
  summaryStateLabel,
  userMessageCount,
  onClose,
}: JournalChatToolsSheetProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-40 transition-opacity",
        isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
      )}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        className="absolute inset-0 bg-background/65 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close reflection tools"
      />

      <section
        id="capture-tools-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="capture-tools-title"
        className={cn(
          "absolute inset-x-0 bottom-0 max-h-[82dvh] overflow-y-auto rounded-t-[1.5rem] border border-border/80 bg-background p-4 shadow-[0_-20px_50px_rgba(12,10,9,0.14)] transition-transform duration-200 ease-out md:inset-y-6 md:left-auto md:right-6 md:w-[30rem] md:max-h-none md:rounded-2xl md:p-5",
          isOpen
            ? "translate-y-0"
            : "translate-y-full md:translate-x-6 md:translate-y-0",
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border/70 pb-3">
          <div>
            <p className="eyebrow">Reflection tools</p>
            <h3 id="capture-tools-title" className="mt-2 text-lg font-medium">
              Guide the conversation
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick mood, check progress, and decide when to summarize.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close tools"
          >
            <XIcon />
          </Button>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <Badge>{moodLabel}</Badge>
            <span>{userMessageCount} messages</span>
            <span>{summaryStateLabel}</span>
          </div>
          {children}
        </div>
      </section>
    </div>
  );
}
