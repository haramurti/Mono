"use client";

import Link from "next/link";

import { ProfileCard } from "@/features/profile/components/profile-card";
import { useProfileController } from "@/features/profile/hooks/use-profile-controller";
import {
  getLastLoginLabel,
  getMemberSinceLabel,
} from "@/features/profile/lib/profile-display";
import {
  AppShellCard,
  AppShellLayout,
} from "@/shared/components/app/auth-app-shell";
import { Button } from "@/shared/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function ProfileContainer() {
  const { isLoggingOut, logout, userQuery } = useProfileController();
  const user = userQuery.data;

  function renderContent() {
    if (userQuery.isLoading) {
      return <Skeleton className="h-72 rounded-[1.5rem]" />;
    }

    if (userQuery.isError || !user) {
      return (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Couldn’t load your profile.</EmptyTitle>
            <EmptyDescription>
              Try refreshing the page or returning to history.
            </EmptyDescription>
          </EmptyHeader>
          <Button asChild>
            <Link href="/history">Return to history</Link>
          </Button>
        </Empty>
      );
    }

    return (
      <ProfileCard
        isLoggingOut={isLoggingOut}
        lastLoginLabel={getLastLoginLabel(user.lastLoginAt)}
        memberSinceLabel={getMemberSinceLabel(user.createdAt)}
        onLogout={logout}
        user={user}
      />
    );
  }

  return (
    <AppShellLayout activeSection="profile">
      <AppShellCard
        title="Profile"
        description="Your Mono account, your last login, and the option to log out."
      >
        {renderContent()}
      </AppShellCard>
    </AppShellLayout>
  );
}
