"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getCurrentUser, logout } from "@/shared/repository/auth/action";

export const authQueryKeys = {
  currentUser: ["auth", "me"] as const,
};

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: authQueryKeys.currentUser,
    queryFn: getCurrentUser,
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
