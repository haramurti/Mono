import { Suspense } from "react";

import { JournalChatContainer } from "@/features/journal-chat/containers/journal-chat-container";

export default function CapturePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <JournalChatContainer />
    </Suspense>
  );
}
