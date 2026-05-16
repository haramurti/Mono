import type { ReactNode } from "react";

export function JournalChatSurface({ children }: { children: ReactNode }) {
  return (
    <section className="flex">
      <div className="flex h-[calc(100dvh-8rem)] min-h-[38rem] w-full flex-col overflow-hidden rounded-[1.75rem] border border-border/80 bg-[var(--surface-glass-soft)] px-4 pb-4 pt-3 md:h-[calc(100dvh-3rem)] md:min-h-[44rem] md:px-6 md:pb-6 md:pt-5">
        {children}
      </div>
    </section>
  );
}
