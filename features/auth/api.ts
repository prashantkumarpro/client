import { apiClient } from "@/lib/api/client";
import type { LoginCredentials, LoginResponse } from "./types";

export const login = async (
  data: LoginCredentials
): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(
    "/user/login",
    data
  );

  return response.data;
};