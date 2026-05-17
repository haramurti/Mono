import type { ReactNode } from "react";

import type { JournalChatMessageItem } from "@/features/journal-chat/lib/journal-chat-display";
import AppLogo from "@/shared/components/app/app-logo";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";

type JournalChatMessageListProps = {
  emptyState?: ReactNode;
  isLoading: boolean;
  messages: JournalChatMessageItem[];
};

function JournalChatMessageRow({
  avatarFallback,
  content,
  isAssistant,
}: JournalChatMessageItem) {
  return (
    <div
      className={cn(
        "motion-rise flex min-w-0 gap-3",
        !isAssistant && "flex-row-reverse",
        isAssistant ? "mt-4" : "mt-8",
      )}
    >
      <Avatar className="mt-1 size-10">
        {isAssistant ? (
          <AvatarFallback className="bg-background">
            <AppLogo className="size-7" />
          </AvatarFallback>
        ) : (
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        )}
      </Avatar>
      <div
        className={cn(
          "min-w-0 max-w-[min(85%,26rem)] whitespace-pre-wrap rounded-[1.5rem] px-4 py-3 text-sm leading-relaxed shadow-[0_1px_0_rgba(15,23,42,0.04)] [overflow-wrap:anywhere] break-words",
          isAssistant
            ? "border border-border/60 bg-background/90 text-card-foreground"
            : "bg-primary text-primary-foreground",
        )}
      >
        {content}
      </div>
    </div>
  );
}

export function JournalChatMessageList({
  emptyState,
  isLoading,
  messages,
}: JournalChatMessageListProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-1 pb-6 pt-2 md:px-2">
      {isLoading
        ? Array.from({ length: 4 }, (_, index) => (
            <Skeleton
              key={`chat-skeleton-${index + 1}`}
              className="h-24 rounded-[1.5rem]"
            />
          ))
        : messages.length
          ? messages.map((message) => (
              <JournalChatMessageRow key={message.id} {...message} />
            ))
          : emptyState}
    </div>
  );
}
