import { apiClient } from "@/shared/lib/axios";
import type { User } from "@/shared/types/mono";

export async function getCurrentUser() {
  const response = await apiClient.get<User>("/me");
  return response.data;
}
