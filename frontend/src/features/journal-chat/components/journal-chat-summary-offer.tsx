import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

type JournalChatSummaryOfferProps = {
  onDismiss: () => void;
  onSummarize: () => void;
};

export function JournalChatSummaryOffer({
  onDismiss,
  onSummarize,
}: JournalChatSummaryOfferProps) {
  return (
    <div className="rounded-[1.1rem] border border-border/70 bg-secondary/35 p-3">
      <p className="text-sm text-card-foreground">
        Ready to summarize whenever you feel done.
      </p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={onSummarize}>
          End &amp; summarize
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
        <Button size="sm" variant="ghost" onClick={onDismiss}>
          Keep writing
        </Button>
      </div>
    </div>
  );
}
