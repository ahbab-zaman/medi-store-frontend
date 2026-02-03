import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "@/store";
import * as orderService from "@/services/order.service";
import { GetOrdersParams } from "@/types";
import { toast } from "sonner";

// Fetch all orders with filters
export function useOrders(params?: GetOrdersParams) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => orderService.getOrders(params),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Fetch single order by ID
export function useOrder(id: string) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
  });
}

// Create order mutation
export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { clearCart } = useCartStore();

  return useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      clearCart(); // Clear cart after successful order
      toast.success("Order placed successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create order");
    },
  });
}

// Update order status mutation
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      orderService.updateOrderStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", variables.id] });
      toast.success("Order status updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update order status");
    },
  });
}

// Cancel order mutation
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderService.cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order cancelled successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to cancel order");
    },
  });
}
