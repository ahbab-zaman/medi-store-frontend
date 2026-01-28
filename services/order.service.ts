import apiClient from "@/lib/axios";
import {
  Order,
  CreateOrderPayload,
  GetOrdersParams,
  PaginatedResponse,
  ApiResponse,
} from "@/types";

export async function getOrders(
  params?: GetOrdersParams,
): Promise<PaginatedResponse<Order>> {
  const response = await apiClient.get<PaginatedResponse<Order>>(
    "/api/orders",
    {
      params,
    },
  );
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
    `/api/orders/${id}/status`,
    {
      status,
    },
  );
  return response.data;
}

export async function cancelOrder(id: string): Promise<ApiResponse<Order>> {
  const response = await apiClient.patch<ApiResponse<Order>>(
    `/api/orders/${id}/cancel`,
  );
  return response.data;
}
