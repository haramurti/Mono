"use client";

import { useRouter } from "next/navigation";

import { toast } from "@/shared/components/ui/sonner";
import {
  useCurrentUserQuery,
  useLogoutMutation,
} from "@/shared/repository/auth/query";

export function useProfileController() {
  const router = useRouter();
  const userQuery = useCurrentUserQuery();
  const logoutMutation = useLogoutMutation();

  function logout() {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.replace("/");
      },
      onError: () => {
        toast.error("Couldn’t log you out.", {
          description: "Try again in a moment.",
        });
      },
    });
  }

  return {
    isLoggingOut: logoutMutation.isPending,
    logout,
    userQuery,
  };
}
