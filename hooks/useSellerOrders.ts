import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as orderService from "@/services/order.service";
import { toast } from "sonner";

export function useSellerOrders() {
  return useQuery({
    queryKey: ["orders", "seller"],
    queryFn: () => orderService.getOrders({ sellerView: "true" }),
  });
}

export function useUpdateSellerOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      // Invalidate both general and specific queries
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order status updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update order status");
    },
  });
}

export function useSellerDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orderService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete order");
    },
  });
}
