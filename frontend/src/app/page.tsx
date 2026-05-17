import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { LandingPage } from "@/features/landing/sections/landing-page";
import { DEMO_SESSION_COOKIE } from "@/shared/lib/auth";

export default async function HomePage() {
  const cookieStore = await cookies();
  const isAuthenticated =
    cookieStore.get(DEMO_SESSION_COOKIE)?.value === "active";

  if (isAuthenticated) {
    redirect("/history");
  }

  return <LandingPage />;
}
