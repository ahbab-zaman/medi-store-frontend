import apiClient from "@/lib/axios";
import { Review, CreateReviewPayload, ApiResponse } from "@/types";

export async function getReviewsByMedicineId(
  medicineId: string,
): Promise<ApiResponse<Review[]>> {
  const response = await apiClient.get<ApiResponse<Review[]>>(
    `/api/medicines/${medicineId}/reviews`,
  );
  return response.data;
}

export async function createReview(
  payload: CreateReviewPayload,
): Promise<ApiResponse<Review>> {
  const response = await apiClient.post<ApiResponse<Review>>(
    "/api/reviews",
    payload,
  );
  return response.data;
}

export async function updateReview(
  id: string,
  payload: { rating?: number; comment?: string },
): Promise<ApiResponse<Review>> {
  const response = await apiClient.patch<ApiResponse<Review>>(
    `/api/reviews/${id}`,
    payload,
  );
  return response.data;
}

export async function deleteReview(id: string): Promise<ApiResponse> {
  const response = await apiClient.delete<ApiResponse>(`/api/reviews/${id}`);
  return response.data;
}
