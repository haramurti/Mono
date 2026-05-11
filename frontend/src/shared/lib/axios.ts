import axios from "axios";

import { env } from "@/shared/lib/env";

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});
