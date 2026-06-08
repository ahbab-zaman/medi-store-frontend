import apiClient from "@/lib/axios";
import { ApiResponse } from "@/types";
import { Review } from "@/types/medicine.types";

export interface CreateReviewPayload {
  medicineId: string;
  rating: number;
  comment: string;
}

export const ReviewAppService = {
  async createReview(payload: CreateReviewPayload) {
    const res = await apiClient.post<ApiResponse<Review>>("/api/reviews", payload);
    return res.data;
  },

  async getMedicineReviews(medicineId: string) {
    const res = await apiClient.get<ApiResponse<Review[]>>(
      `/api/reviews/medicine/${medicineId}`,
    );
    return res.data;
  },

  async getAllReviewsForAdmin() {
    const res = await apiClient.get<ApiResponse<Review[]>>(
      "/api/reviews/admin/all",
    );
    return res.data;
  },

  async updateReviewStatus(id: string, status: string) {
    const res = await apiClient.patch<ApiResponse<Review>>(
      `/api/reviews/admin/${id}/status`,
      { status },
    );
    return res.data;
  },

  async deleteReview(id: string) {
    const res = await apiClient.delete<ApiResponse<Review>>(
      `/api/reviews/admin/${id}`,
    );
    return res.data;
  },
};
