import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUIStore } from "@/store";
import * as orderService from "@/services/order.service";

export function useSellerOrders() {
  return useQuery({
    queryKey: ["orders", "seller"],
    queryFn: () => orderService.getSellerOrders(),
  });
}

export function useUpdateSellerOrderStatus() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      orderService.updateSellerOrderStatus(id, status),
    onSuccess: () => {
      // Invalidate both general and specific queries
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      addNotification({
        type: "success",
        message: "Order status updated successfully!",
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
