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
    enabled: !user && !!accessToken, // Only fetch if we have a token but no user, or on mount check
    retry: false,
    staleTime: Infinity,
  });

  // Sync user data from query to store if needed
  if (meData?.data && !user) {
    setUser(meData.data, accessToken);
  }

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.loginUser,
    onSuccess: (data) => {
      // Optimization: If the backend returns the user object, use it directly
      // instead of fetching 'me' separately.
      if (data.success && data.data?.user) {
        setUser(data.data.user, data.data.accessToken);
        addNotification({
          type: "success",
          message: "Login successful!",
        });
        // Immediate redirect
        router.push("/");
      } else {
        // Fallback to fetch user if not provided in login response
        // This keeps compatibility if backend changes
        queryClient
          .fetchQuery({
            queryKey: ["auth", "me"],
            queryFn: authService.getMe,
            staleTime: 0,
          })
          .then((meData) => {
            if (meData?.data) {
              setUser(meData.data, data.data?.accessToken);
              addNotification({
                type: "success",
                message: "Login successful!",
              });
              router.push("/");
            }
          })
          .catch(() => {
            addNotification({
              type: "warning",
              message:
                "Login successful, but profile loading failed. Please refresh.",
            });
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
      // Optimization: Auto-login if registration returns token/user
      if (data.success && data.data?.user && data.data?.accessToken) {
        setUser(data.data.user, data.data.accessToken);
        addNotification({
          type: "success",
          message: "Registration successful! Welcome.",
        });
        router.push("/");
      } else {
        addNotification({
          type: "success",
          message: "Registration successful! Please login.",
        });
        router.push("/login");
      }
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

  // Update Profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (data) => {
      if (data.success && data.data) {
        setUser(data.data, accessToken);
        addNotification({
          type: "success",
          message: "Profile updated successfully!",
        });
        queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      }
    },
    onError: (error: any) => {
      addNotification({
        type: "error",
        message: error.message || "Failed to update profile",
      });
    },
  });

  return {
    // State
    user,
    accessToken,
    isAuthenticated: !!user,
    isLoading:
      isLoadingMe ||
      loginMutation.isPending ||
      registerMutation.isPending ||
      updateProfileMutation.isPending,

    // Actions
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutate,
    updateProfile: updateProfileMutation.mutateAsync,

    // Mutation states
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    updateProfileError: updateProfileMutation.error,
    isUpdatingProfile: updateProfileMutation.isPending,
  };
}
