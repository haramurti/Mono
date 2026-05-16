import { Suspense } from "react";

import { DashboardContainer } from "@/features/dashboard/containers/dashboard-container";

export default function HistoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <DashboardContainer />
    </Suspense>
  );
}
