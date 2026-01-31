import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminAppService } from "@/services/admin.service";
import { useAuthStore } from "@/store";
import { useUIStore } from "@/store";

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
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      AdminAppService.updateOrderStatus(accessToken!, id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      addNotification({
        type: "success",
        message: "Order status updated successfully",
      });
    },
    onError: (error: any) => {
      addNotification({
        type: "error",
        message: error.message || "Failed to update order status",
      });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: (orderId: string) =>
      AdminAppService.deleteOrder(accessToken!, orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      addNotification({
        type: "success",
        message: "Order deleted successfully",
      });
    },
    onError: (error: any) => {
      addNotification({
        type: "error",
        message: error.message || "Failed to delete order",
      });
    },
  });
}
