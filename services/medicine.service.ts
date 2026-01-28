import apiClient from "@/lib/axios";
import {
  Medicine,
  GetMedicinesParams,
  CreateMedicinePayload,
  UpdateMedicinePayload,
  PaginatedResponse,
  ApiResponse,
} from "@/types";

export async function getMedicines(
  params?: GetMedicinesParams,
): Promise<PaginatedResponse<Medicine>> {
  const response = await apiClient.get<PaginatedResponse<Medicine>>(
    "/api/medicines",
    {
      params,
    },
  );
  return response.data;
}

export async function getMedicineById(
  id: string,
): Promise<ApiResponse<Medicine>> {
  const response = await apiClient.get<ApiResponse<Medicine>>(
    `/api/medicines/${id}`,
  );
  return response.data;
}

export async function createMedicine(
  payload: CreateMedicinePayload,
): Promise<ApiResponse<Medicine>> {
  const response = await apiClient.post<ApiResponse<Medicine>>(
    "/api/medicines",
    payload,
  );
  return response.data;
}

export async function updateMedicine(
  payload: UpdateMedicinePayload,
): Promise<ApiResponse<Medicine>> {
  const { id, ...data } = payload;
  const response = await apiClient.patch<ApiResponse<Medicine>>(
    `/api/medicines/${id}`,
    data,
  );
  return response.data;
}

export async function deleteMedicine(id: string): Promise<ApiResponse> {
  const response = await apiClient.delete<ApiResponse>(`/api/medicines/${id}`);
  return response.data;
}

export async function searchMedicines(
  query: string,
): Promise<PaginatedResponse<Medicine>> {
  const response = await apiClient.get<PaginatedResponse<Medicine>>(
    "/api/medicines",
    {
      params: { search: query },
    },
  );
  return response.data;
}
