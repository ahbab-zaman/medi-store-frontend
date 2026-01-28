import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store";
import { useUIStore } from "@/store";
import * as authService from "@/services/auth.service";
import { LoginPayload, RegisterPayload } from "@/types";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, setUser, logout: logoutStore } = useAuthStore();
  const { addNotification } = useUIStore();

  // Fetch current user
  const { data: meData, isLoading: isLoadingMe } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authService.getMe,
    enabled: !user, // Only fetch if user is not in store
    retry: false,
    staleTime: Infinity, // User data doesn't change often
  });

  // Sync user data from query to store
  if (meData?.data && !user) {
    setUser(meData.data);
  }

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.loginUser,
    onSuccess: (data) => {
      if (data.data?.user) {
        setUser(data.data.user);
        queryClient.setQueryData(["auth", "me"], data);
        addNotification({
          type: "success",
          message: "Login successful!",
        });
        // Navigation handled by component
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
      // Navigation handled by component
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
      queryClient.clear(); // Clear all cached data
      addNotification({
        type: "success",
        message: "Logged out successfully",
      });
      router.push("/login"); // Logout always goes to login, this is safe to keep or remove. Keeping for convenience.
    },
    onError: (error: any) => {
      // Even if API fails, clear local state
      logoutStore();
      queryClient.clear();
      router.push("/login");
    },
  });

  return {
    // State
    user,
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
