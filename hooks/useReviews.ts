import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as reviewService from "@/services/review.service";
import { toast } from "sonner";

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

  return useMutation({
    mutationFn: reviewService.createReview,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.medicineId],
      });
      queryClient.invalidateQueries({
        queryKey: ["medicines", variables.medicineId],
      });
      toast.success("Review submitted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit review");
    },
  });
}

// Update review mutation
export function useUpdateReview() {
  const queryClient = useQueryClient();

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
      toast.success("Review updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update review");
    },
  });
}

// Delete review mutation
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewService.deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete review");
    },
  });
}
