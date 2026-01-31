import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminAppService } from "@/services/admin.service";
import { useAuthStore } from "@/store";
import { toast } from "sonner";

export function useAdminOrders() {
  const { accessToken } = useAuthStore();

  return useQuery({
    queryKey: ["admin", "orders"],
    queryFn: () => AdminAppService.getAllOrders(accessToken!),
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      AdminAppService.updateOrderStatus(accessToken!, id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      toast.success("Order status updated successfully", {
        description: "The order status has been changed",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to update order status", {
        description: error.message || "Please try again later",
      });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();

  return useMutation({
    mutationFn: (orderId: string) =>
      AdminAppService.deleteOrder(accessToken!, orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      toast.success("Order deleted successfully", {
        description: "The order has been removed from the system",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to delete order", {
        description: error.message || "Please try again later",
      });
    },
  });
}
