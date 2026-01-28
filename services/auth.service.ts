import apiClient from "@/lib/axios";
import {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  MeResponse,
} from "@/types";

export async function registerUser(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    "/api/auth/register",
    payload,
  );
  return response.data;
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    "/api/auth/login",
    payload,
  );
  return response.data;
}

export async function logoutUser(): Promise<{
  success: boolean;
  message: string;
}> {
  const response = await apiClient.post("/api/auth/logout");
  return response.data;
}

export async function getMe(): Promise<MeResponse> {
  const response = await apiClient.get<MeResponse>("/api/auth/me");
  return response.data;
}
