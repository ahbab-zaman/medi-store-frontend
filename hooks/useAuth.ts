"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store";
import * as authService from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") return message;
  }
  return fallback;
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    user,
    accessToken,
    authReady,
    setUser,
    setAccessToken,
    markAuthReady,
    logout: logoutStore,
  } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (payload: Parameters<typeof authService.loginUser>[0]) => {
      const data = await authService.loginUser(payload);

      if (!data.success) {
        return data;
      }

      if (data.data?.accessToken) {
        setAccessToken(data.data.accessToken);
      }

      if (data.data?.user) {
        return data;
      }

      try {
        const me = await authService.getMe();

        if (me.success && me.data) {
          return {
            ...data,
            data: {
              user: me.data,
              accessToken: data.data?.accessToken,
            },
          };
        }
      } catch {
        // Fall through to the original response below.
      }

      return data;
    },
    onSuccess: (data) => {
      if (data.success && data.data?.accessToken) {
        setAccessToken(data.data.accessToken);
      }

      if (data.success && data.data?.user) {
        setUser(data.data.user, data.data.accessToken ?? null);
        markAuthReady();
        toast.success("Login successful!");
        return;
      }

      markAuthReady();
      toast.warning("Login successful, but profile data was not returned.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Login failed"));
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.registerUser,
    onSuccess: (data) => {
      if (data.success && data.data?.user && data.data?.accessToken) {
        setUser(data.data.user, data.data.accessToken);
        markAuthReady();
        toast.success("Registration successful! Welcome.");
        router.push("/");
      } else {
        toast.success("Registration successful! Please login.");
        router.push("/login");
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Registration failed"));
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logoutUser,
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      toast.success("Logged out successfully");
      router.push("/login");
    },
    onError: () => {
      logoutStore();
      queryClient.clear();
      router.push("/login");
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (data) => {
      if (data.success && data.data) {
        setUser(data.data, accessToken);
        toast.success("Profile updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update profile"));
    },
  });

  return {
    user,
    accessToken,
    authReady,
    isAuthenticated: authReady && !!user,
    isLoading:
      loginMutation.isPending ||
      registerMutation.isPending ||
      updateProfileMutation.isPending,
    isBootstrapping: !authReady,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutate,
    updateProfile: updateProfileMutation.mutateAsync,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    updateProfileError: updateProfileMutation.error,
    isUpdatingProfile: updateProfileMutation.isPending,
  };
}
