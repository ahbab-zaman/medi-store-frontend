import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ReviewAppService,
  CreateReviewPayload,
} from "@/services/review.service";
import { toast } from "sonner";

export function useMedicineReviews(medicineId: string) {
  return useQuery({
    queryKey: ["reviews", medicineId],
    queryFn: () => ReviewAppService.getMedicineReviews(medicineId),
    enabled: !!medicineId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) =>
      ReviewAppService.createReview(payload),
    onSuccess: (_, variables) => {
      // We don't necessarily invalidate immediately because it needs approval,
      // but showing a success message is key.
      toast.success("Review submitted!", {
        description: "Your review is pending approval from an admin.",
      });
      // Optionally invalidate if we showed pending reviews (not required by spec but good practice)
      // queryClient.invalidateQueries({ queryKey: ["reviews", variables.medicineId] });
    },
    onError: (error: any) => {
      toast.error("Failed to submit review", {
        description: error.response?.data?.message || "Something went wrong.",
      });
    },
  });
}

export function useAdminReviews() {
  return useQuery({
    queryKey: ["admin", "reviews"],
    queryFn: () => ReviewAppService.getAllReviewsForAdmin(),
  });
}

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ReviewAppService.updateReviewStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      toast.success("Review status updated");
    },
    onError: (error: any) => {
      toast.error("Failed to update status");
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ReviewAppService.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      toast.success("Review deleted");
    },
    onError: (error: any) => {
      toast.error("Failed to delete review");
    },
  });
}
