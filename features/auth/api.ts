import { apiClient } from "@/lib/api/client";
import type { LoginCredentials, LoginResponse, User } from "./types";

export const login = async (
  data: LoginCredentials
): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(
    "/user/login",
    data
  );

  return response.data;
};


export const getUser = async (): Promise<User> => {
  const response = await apiClient.get<User>('/user')

  return response.data
}