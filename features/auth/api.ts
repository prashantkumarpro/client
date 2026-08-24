import { apiClient } from "@/lib/api/client";
import type { LoginCredentials, LoginResponse, RegisterCrendentials, RegisterResponse, User } from "./types";



export const register = async (
  data: RegisterCrendentials
): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>(
    '/user/register',
    data
  )

  return response.data
}
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

export const logout = async (): Promise<void> => {
  await apiClient.post('/user/logout')
}