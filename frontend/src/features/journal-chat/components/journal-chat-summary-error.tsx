import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";

type JournalChatSummaryErrorProps = {
  isRetrying: boolean;
  onRetry: () => void;
};

export function JournalChatSummaryError({
  isRetrying,
  onRetry,
}: JournalChatSummaryErrorProps) {
  return (
    <Alert variant="destructive" className="motion-settle mt-4">
      <AlertTitle>Couldn’t summarize your journal.</AlertTitle>
      <AlertDescription>
        Your chat is still saved safely. Try again when you’re ready.
      </AlertDescription>
      <div className="mt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          disabled={isRetrying}
        >
          Retry summarize
        </Button>
      </div>
    </Alert>
  );
}
