import axios from "axios";
import {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  MeResponse,
  UpdateProfilePayload,
} from "@/types";

// Use standard axios for Next.js API routes (relative paths)
const nextAuthClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

export async function registerUser(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const response = await nextAuthClient.post<AuthResponse>(
    "/api/auth/register",
    payload,
  );
  return response.data;
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const response = await nextAuthClient.post<AuthResponse>(
    "/api/auth/login",
    payload,
  );
  return response.data;
}

export async function logoutUser(): Promise<{
  success: boolean;
  message: string;
}> {
  const response = await nextAuthClient.post("/api/auth/logout");
  return response.data;
}

export async function getMe(): Promise<MeResponse> {
  const response = await nextAuthClient.get<MeResponse>("/api/auth/me");
  return response.data;
}

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<MeResponse> {
  const response = await nextAuthClient.patch<MeResponse>(
    "/api/users/my-profile",
    payload,
  );
  return response.data;
}
