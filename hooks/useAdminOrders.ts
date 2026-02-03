import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminAppService } from "@/services/admin.service";
import * as orderService from "@/services/order.service";
import { useAuthStore } from "@/store";
import { toast } from "sonner";

export function useAdminOrders() {
  return useQuery({
    queryKey: ["admin", "orders"],
    queryFn: () => AdminAppService.getAllOrders(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order status updated successfully", {
        description: "The order status has been changed",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to update order status", {
        description:
          error.data?.message || error.message || "Please try again later",
      });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderService.deleteOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order deleted successfully", {
        description: "The order has been removed from the system",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to delete order", {
        description:
          error.data?.message || error.message || "Please try again later",
      });
    },
  });
}
