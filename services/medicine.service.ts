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
  payload: FormData | CreateMedicinePayload,
): Promise<ApiResponse<Medicine>> {
  const isFormData = payload instanceof FormData;
  // Remove Content-Type so axios sets multipart/form-data with boundary for FormData
  const response = await apiClient.post<ApiResponse<Medicine>>(
    "/api/medicines/seller",
    payload,
    {
      headers: isFormData ? { "Content-Type": undefined } : undefined,
    },
  );
  return response.data;
}

export async function updateMedicine(payload: {
  id: string;
  data: FormData | UpdateMedicinePayload;
}): Promise<ApiResponse<Medicine>> {
  const { id, data } = payload;
  const isFormData = data instanceof FormData;

  const response = await apiClient.put<ApiResponse<Medicine>>(
    `/api/medicines/seller/${id}`,
    data,
    {
      headers: isFormData ? { "Content-Type": undefined } : undefined,
    },
  );
  return response.data;
}

export async function deleteMedicine(id: string): Promise<ApiResponse<null>> {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/api/medicines/seller/${id}`,
  );
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
