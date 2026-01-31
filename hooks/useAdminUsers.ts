import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminAppService } from "@/services/admin.service";
import { useAuthStore } from "@/store";
import { useUIStore } from "@/store";

export function useAdminUsers() {
  const { accessToken } = useAuthStore();

  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => AdminAppService.getAllUsers(accessToken!),
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateUserBanStatus() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: ({ userId, isBanned }: { userId: string; isBanned: boolean }) =>
      AdminAppService.updateUserBanStatus(accessToken!, userId, isBanned),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      addNotification({
        type: "success",
        message: "User status updated successfully",
      });
    },
    onError: (error: any) => {
      addNotification({
        type: "error",
        message: error.message || "Failed to update user status",
      });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: ({
      userId,
      role,
    }: {
      userId: string;
      role: "ADMIN" | "SELLER" | "CUSTOMER";
    }) => AdminAppService.updateUserRole(accessToken!, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      addNotification({
        type: "success",
        message: "User role updated successfully",
      });
    },
    onError: (error: any) => {
      addNotification({
        type: "error",
        message: error.message || "Failed to update user role",
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: (userId: string) =>
      AdminAppService.deleteUser(accessToken!, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      addNotification({
        type: "success",
        message: "User deleted successfully",
      });
    },
    onError: (error: any) => {
      addNotification({
        type: "error",
        message: error.message || "Failed to delete user",
      });
    },
  });
}
