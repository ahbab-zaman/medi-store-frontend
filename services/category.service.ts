import apiClient from "@/lib/axios";
import { Category, ApiResponse } from "@/types";

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  const response =
    await apiClient.get<ApiResponse<Category[]>>("/api/categories");
  return response.data;
}

export async function getCategoryById(
  id: string,
): Promise<ApiResponse<Category>> {
  const response = await apiClient.get<ApiResponse<Category>>(
    `/api/categories/${id}`,
  );
  return response.data;
}

export async function createCategory(payload: {
  name: string;
  image?: string;
}): Promise<ApiResponse<Category>> {
  const response = await apiClient.post<ApiResponse<Category>>(
    "/api/categories",
    payload,
  );
  return response.data;
}

export async function updateCategory(
  id: string,
  payload: { name?: string; image?: string },
): Promise<ApiResponse<Category>> {
  const response = await apiClient.patch<ApiResponse<Category>>(
    `/api/categories/${id}`,
    payload,
  );
  return response.data;
}

export async function deleteCategory(id: string): Promise<ApiResponse> {
  const response = await apiClient.delete<ApiResponse>(`/api/categories/${id}`);
  return response.data;
}
