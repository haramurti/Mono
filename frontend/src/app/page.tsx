import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { LandingPage } from '@/features/landing/sections/landing-page';
import { DEMO_SESSION_COOKIE } from '@/shared/lib/auth';
import { getTodayChat } from '@/shared/lib/demo-store';

export default async function HomePage() {
   const cookieStore = await cookies();
   const isAuthenticated =
      cookieStore.get(DEMO_SESSION_COOKIE)?.value === 'active';

   //   if (isAuthenticated) {
   //     const todayChat = getTodayChat();
   //     const targetPath =
   //       todayChat.journalState.status === "summarized" ||
   //       todayChat.journalState.status === "edited"
   //         ? `/journal/${todayChat.date}`
   //         : "/capture";
   //     redirect(targetPath);
   //   }

   return <LandingPage />;
}
