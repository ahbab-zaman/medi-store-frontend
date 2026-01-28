import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUIStore } from "@/store";
import * as reviewService from "@/services/review.service";
import { CreateReviewPayload } from "@/types";

// Fetch reviews for a specific medicine
export function useReviews(medicineId: string) {
  return useQuery({
    queryKey: ["reviews", medicineId],
    queryFn: () => reviewService.getReviewsByMedicineId(medicineId),
    enabled: !!medicineId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Create review mutation
export function useCreateReview() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: reviewService.createReview,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.medicineId],
      });
      queryClient.invalidateQueries({
        queryKey: ["medicines", variables.medicineId],
      });
      addNotification({
        type: "success",
        message: "Review submitted successfully!",
      });
    },
    onError: (error: any) => {
      addNotification({
        type: "error",
        message: error.message || "Failed to submit review",
      });
    },
  });
}

// Update review mutation
export function useUpdateReview() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: string;
      rating?: number;
      comment?: string;
    }) => reviewService.updateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      addNotification({
        type: "success",
        message: "Review updated successfully!",
      });
    },
    onError: (error: any) => {
      addNotification({
        type: "error",
        message: error.message || "Failed to update review",
      });
    },
  });
}

// Delete review mutation
export function useDeleteReview() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: reviewService.deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      addNotification({
        type: "success",
        message: "Review deleted successfully!",
      });
    },
    onError: (error: any) => {
      addNotification({
        type: "error",
        message: error.message || "Failed to delete review",
      });
    },
  });
}
