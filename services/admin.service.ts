import { env } from "@/utils/env";

const ADMIN_API_URL = `${env.backendApiBaseUrl}/admin`;

export type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SELLER" | "CUSTOMER";
  isBanned: boolean;
  createdAt: string;
};

export const AdminAppService = {
  async getAllUsers(token: string) {
    const res = await fetch(`${ADMIN_API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    const data = await res.json();
    return data.data as User[];
  },

  async updateUserBanStatus(token: string, userId: string, isBanned: boolean) {
    const res = await fetch(`${ADMIN_API_URL}/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isBanned }),
    });
    if (!res.ok) throw new Error("Failed to update user status");
    const data = await res.json();
    return data.data;
  },

  async updateUserRole(
    token: string,
    userId: string,
    role: "ADMIN" | "SELLER" | "CUSTOMER",
  ) {
    const res = await fetch(`${ADMIN_API_URL}/users/${userId}/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) throw new Error("Failed to update user role");
    const data = await res.json();
    return data.data;
  },

  async deleteUser(token: string, userId: string) {
    const res = await fetch(`${ADMIN_API_URL}/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete user");
    return true;
  },

  async getAllCategories() {
    const res = await fetch(`${env.backendApiBaseUrl}/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    const data = await res.json();
    // Transform image URLs to absolute URLs
    const categories = data.data.map((cat: any) => ({
      ...cat,
      image: cat.imageUrl?.startsWith("http")
        ? cat.imageUrl
        : `${env.backendApiBaseUrl}${cat.imageUrl}`,
    }));
    return categories;
  },

  async createCategory(token: string, formData: FormData) {
    const res = await fetch(`${env.backendApiBaseUrl}/categories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to create category");
    const data = await res.json();
    return data.data;
  },

  async updateCategory(token: string, id: string, formData: FormData) {
    const res = await fetch(`${env.backendApiBaseUrl}/categories/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to update category");
    const data = await res.json();
    return data.data;
  },

  async deleteCategory(token: string, id: string) {
    const res = await fetch(`${env.backendApiBaseUrl}/categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete category");
    return true;
  },

  async getAllOrders(token: string) {
    const res = await fetch(`${ADMIN_API_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch orders");
    const data = await res.json();
    return data.data;
  },

  async updateOrderStatus(token: string, orderId: string, status: string) {
    const res = await fetch(`${ADMIN_API_URL}/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update order status");
    const data = await res.json();
    return data.data;
  },

  async deleteOrder(token: string, orderId: string) {
    const res = await fetch(`${ADMIN_API_URL}/orders/${orderId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete order");
    return true;
  },

  async getAllMedicines(token: string) {
    const res = await fetch(`${env.backendApiBaseUrl}/medicines/admin/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch medicines");
    const data = await res.json();
    return data;
  },

  async deleteMedicine(token: string, medicineId: string) {
    const res = await fetch(
      `${env.backendApiBaseUrl}/medicines/seller/${medicineId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!res.ok) throw new Error("Failed to delete medicine");
    return true;
  },
};
