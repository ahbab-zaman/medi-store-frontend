import apiClient from "@/lib/axios";
import { ApiResponse } from "@/types";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SELLER" | "CUSTOMER";
  isBanned: boolean;
  createdAt: string;
};

export const AdminAppService = {
  async getAllUsers() {
    const res = await apiClient.get<ApiResponse<User[]>>("/api/admin/users");
    return res.data.data;
  },

  async updateUserBanStatus(userId: string, isBanned: boolean) {
    const res = await apiClient.patch<ApiResponse<any>>(
      `/api/admin/users/${userId}/ban`,
      { isBanned },
    );
    return res.data.data;
  },

  async updateUserRole(userId: string, role: "ADMIN" | "SELLER" | "CUSTOMER") {
    const res = await apiClient.patch<ApiResponse<any>>(
      `/api/admin/users/${userId}/role`,
      { role },
    );
    return res.data.data;
  },

  async deleteUser(userId: string) {
    await apiClient.delete(`/api/admin/users/${userId}`);
    return true;
  },

  async getAllCategories() {
    const res = await apiClient.get<ApiResponse<any[]>>("/api/categories");
    return res.data.data;
  },

  async createCategory(payload: { name: string; description?: string }) {
    const res = await apiClient.post<ApiResponse<any>>(
      "/api/categories",
      payload,
    );
    return res.data.data;
  },

  async updateCategory(
    id: string,
    payload: { name?: string; description?: string },
  ) {
    const res = await apiClient.put<ApiResponse<any>>(
      `/api/categories/${id}`,
      payload,
    );
    return res.data.data;
  },

  async deleteCategory(id: string) {
    await apiClient.delete(`/api/categories/${id}`);
    return true;
  },

  async getAllOrders() {
    const res = await apiClient.get<ApiResponse<any[]>>("/api/admin/orders");
    return res.data.data;
  },

  async updateOrderStatus(orderId: string, status: string) {
    const res = await apiClient.patch<ApiResponse<any>>(
      `/api/admin/orders/${orderId}`,
      { status },
    );
    return res.data.data;
  },

  async deleteOrder(orderId: string) {
    await apiClient.delete(`/api/admin/orders/${orderId}`);
    return true;
  },

  async getAllMedicines() {
    const res = await apiClient.get<ApiResponse<any>>(
      "/api/medicines/admin/all",
    );
    return res.data.data;
  },

  async deleteMedicine(medicineId: string) {
    await apiClient.delete(`/api/medicines/seller/${medicineId}`);
    return true;
  },
};
