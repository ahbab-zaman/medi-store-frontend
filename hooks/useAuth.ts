import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store";
import { useUIStore } from "@/store";
import * as authService from "@/services/auth.service";
import { LoginPayload, RegisterPayload } from "@/types";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, accessToken, setUser, logout: logoutStore } = useAuthStore();
  const { addNotification } = useUIStore();

  // Fetch current user
  const { data: meData, isLoading: isLoadingMe } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authService.getMe,
    enabled: !user, // Only fetch if user is not in store
    retry: false,
    staleTime: Infinity,
  });

  // Sync user data from query to store
  if (meData?.data && !user) {
    setUser(meData.data, accessToken);
  }

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.loginUser,
    onSuccess: async (data) => {
      try {
        const meData = await queryClient.fetchQuery({
          queryKey: ["auth", "me"],
          queryFn: authService.getMe,
          staleTime: 0,
        });

        if (meData?.data) {
          setUser(meData.data, data.data?.accessToken);
          addNotification({
            type: "success",
            message: "Login successful!",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user after login", error);
        addNotification({
          type: "warning",
          message:
            "Login successful, but profile loading failed. Please refresh.",
        });
      }
    },
    onError: (error: any) => {
      addNotification({
        type: "error",
        message: error.message || "Login failed",
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.registerUser,
    onSuccess: (data) => {
      addNotification({
        type: "success",
        message: "Registration successful! Please login.",
      });
    },
    onError: (error: any) => {
      addNotification({
        type: "error",
        message: error.message || "Registration failed",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authService.logoutUser,
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      addNotification({
        type: "success",
        message: "Logged out successfully",
      });
      router.push("/login");
    },
    onError: (error: any) => {
      logoutStore();
      queryClient.clear();
      router.push("/login");
    },
  });

  return {
    // State
    user,
    accessToken,
    isAuthenticated: !!user,
    isLoading:
      isLoadingMe || loginMutation.isPending || registerMutation.isPending,

    // Actions
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutate,

    // Mutation states
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}
