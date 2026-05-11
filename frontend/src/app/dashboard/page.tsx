import { Suspense } from "react";

import { DashboardContainer } from "@/features/dashboard/containers/dashboard-container";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <DashboardContainer />
    </Suspense>
  );
}
