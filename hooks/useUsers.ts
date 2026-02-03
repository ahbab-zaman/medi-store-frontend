import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminAppService } from "@/services/admin.service";
import { toast } from "sonner";

export function useUsers() {
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
      toast.success("User status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update user status");
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => AdminAppService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete user");
    },
  });
}
