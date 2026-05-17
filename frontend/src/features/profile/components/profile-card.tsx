import { Loader2Icon, LogOutIcon } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import type { User } from "@/shared/types/mono";

type ProfileCardProps = {
  isLoggingOut: boolean;
  lastLoginLabel: string;
  memberSinceLabel: string;
  onLogout: () => void;
  user: User;
};

export function ProfileCard({
  isLoggingOut,
  lastLoginLabel,
  memberSinceLabel,
  onLogout,
  user,
}: ProfileCardProps) {
  const initials = user.name?.slice(0, 2).toUpperCase() ?? "MO";

  return (
    <Card className="orb-panel bg-[var(--surface-glass-soft)]">
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Avatar size="lg">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1 text-sm text-muted-foreground">
            <span>{lastLoginLabel}</span>
            <span>{memberSinceLabel}</span>
          </div>
        </div>

        <div className="rounded-[1.2rem] border border-border/70 bg-background/80 p-4 text-sm leading-relaxed text-muted-foreground">
          Mono keeps your reflections gentle and private. Logging out clears
          your local session on this device.
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={onLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Logging out
              </>
            ) : (
              <>
                <LogOutIcon data-icon="inline-start" />
                Log out
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
