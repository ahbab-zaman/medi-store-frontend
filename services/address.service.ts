import apiClient from "@/lib/axios";
import { ApiResponse } from "@/types";

export interface AddressApiRecord {
  id: string;
  userId: string;
  name: string;
  firstname: string;
  lastname: string;
  address_1: string;
  address_2: string;
  road: string;
  area: string;
  landmark?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  mobileCountryCode: string;
  mobile: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Area {
  id: string;
  name: string;
  status: string;
}

export interface AddressCreatePayload {
  name: string;
  firstname: string;
  lastname: string;
  address_1: string;
  address_2: string;
  road: string;
  area?: string;
  landmark?: string;
  latitude?: string;
  longitude?: string;
  mobile_country_code?: string;
  mobile: string;
  default?: number;
}

export async function getAddresses(): Promise<ApiResponse<AddressApiRecord[]>> {
  const response = await apiClient.get<ApiResponse<AddressApiRecord[]>>(
    "/api/addresses",
  );
  return response.data;
}

export async function getAddressById(
  id: string,
): Promise<ApiResponse<AddressApiRecord>> {
  const response = await apiClient.get<ApiResponse<AddressApiRecord>>(
    `/api/addresses/${id}`,
  );
  return response.data;
}

export async function createAddress(
  payload: AddressCreatePayload,
): Promise<ApiResponse<AddressApiRecord>> {
  const response = await apiClient.post<ApiResponse<AddressApiRecord>>(
    "/api/addresses",
    payload,
  );
  return response.data;
}

export async function updateAddress(
  id: string,
  payload: Partial<AddressCreatePayload>,
): Promise<ApiResponse<AddressApiRecord>> {
  const response = await apiClient.patch<ApiResponse<AddressApiRecord>>(
    `/api/addresses/${id}`,
    payload,
  );
  return response.data;
}

export async function deleteAddress(id: string): Promise<ApiResponse<null>> {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/api/addresses/${id}`,
  );
  return response.data;
}

export async function getAreas(): Promise<ApiResponse<Area[]>> {
  const response = await apiClient.get<ApiResponse<Area[]>>(
    "/api/addresses/areas",
  );
  return response.data;
}
