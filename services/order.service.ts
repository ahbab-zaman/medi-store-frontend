import apiClient from "@/lib/axios";
import {
  Order,
  CreateOrderPayload,
  GetOrdersParams,
  ApiResponse,
} from "@/types";

export async function getOrders(
  params?: GetOrdersParams,
): Promise<ApiResponse<Order[]>> {
  const response = await apiClient.get<ApiResponse<Order[]>>("/api/orders", {
    params,
  });
  return response.data;
}

export async function getOrderById(id: string): Promise<ApiResponse<Order>> {
  const response = await apiClient.get<ApiResponse<Order>>(`/api/orders/${id}`);
  return response.data;
}

export async function createOrder(
  payload: CreateOrderPayload,
): Promise<ApiResponse<Order>> {
  const response = await apiClient.post<ApiResponse<Order>>(
    "/api/orders",
    payload,
  );
  return response.data;
}

export async function updateOrderStatus(
  id: string,
  status: string,
): Promise<ApiResponse<Order>> {
  const response = await apiClient.patch<ApiResponse<Order>>(
    `/api/orders/${id}`,
    {
      status,
    },
  );
  return response.data;
}

export async function deleteOrder(id: string): Promise<ApiResponse<null>> {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/api/orders/${id}`,
  );
  return response.data;
}

export async function cancelOrder(id: string): Promise<ApiResponse<Order>> {
  // Utilizing the update endpoint with CANCELLED status
  // Note: Backend might need permission adjustment for Customers if this is for them
  const response = await apiClient.patch<ApiResponse<Order>>(
    `/api/orders/${id}`,
    { status: "CANCELLED" },
  );
  return response.data;
}
