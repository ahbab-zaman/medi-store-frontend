import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminAppService } from "@/services/admin.service";
import { toast } from "sonner";

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => AdminAppService.getAllUsers(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateUserBanStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, isBanned }: { userId: string; isBanned: boolean }) =>
      AdminAppService.updateUserBanStatus(userId, isBanned),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User status updated successfully", {
        description: "The user's ban status has been changed",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to update user status", {
        description:
          error.data?.message || error.message || "Please try again later",
      });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      role,
    }: {
      userId: string;
      role: "ADMIN" | "SELLER" | "CUSTOMER";
    }) => AdminAppService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User role updated successfully", {
        description: "The user's role has been changed",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to update user role", {
        description:
          error.data?.message || error.message || "Please try again later",
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => AdminAppService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User deleted successfully", {
        description: "The user has been permanently removed",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to delete user", {
        description:
          error.data?.message || error.message || "Please try again later",
      });
    },
  });
}
