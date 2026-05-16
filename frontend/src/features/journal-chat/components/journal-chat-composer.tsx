import { Button } from "@/shared/components/ui/button";
import { FieldDescription } from "@/shared/components/ui/field";
import { Textarea } from "@/shared/components/ui/textarea";

type JournalChatComposerProps = {
  draft: string;
  helperText: string;
  isComposerDisabled: boolean;
  isSendDisabled: boolean;
  isSummarizeDisabled: boolean;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onSummarize: () => void;
};

export function JournalChatComposer({
  draft,
  helperText,
  isComposerDisabled,
  isSendDisabled,
  isSummarizeDisabled,
  onDraftChange,
  onSend,
  onSummarize,
}: JournalChatComposerProps) {
  return (
    <div className="mt-auto border-t border-border/60 pt-4">
      <div className="rounded-[1.4rem] border border-border/70 bg-background/80 p-3 md:p-4">
        <Textarea
          id="journal-message"
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder="Write a little more about what happened, what stayed with you, or what feels unfinished."
          disabled={isComposerDisabled}
          className="min-h-24 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        />

        <div className="mt-3 flex flex-col gap-3 border-t border-border/60 pt-3 sm:flex-row sm:items-end sm:justify-between">
          <FieldDescription className="max-w-[28rem] text-xs leading-relaxed">
            {helperText}
          </FieldDescription>
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={onSummarize}
              disabled={isSummarizeDisabled}
            >
              Summarize
            </Button>
            <Button onClick={onSend} disabled={isSendDisabled}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
