"use client";

import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/shared/repository/auth/action";

export const authQueryKeys = {
  currentUser: ["auth", "me"] as const,
};

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: authQueryKeys.currentUser,
    queryFn: getCurrentUser,
  });
}
