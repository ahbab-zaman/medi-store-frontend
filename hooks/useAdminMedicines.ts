import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminAppService } from "@/services/admin.service";
import { useAuthStore } from "@/store";
import { toast } from "sonner";

export function useAdminMedicines() {
  const { accessToken } = useAuthStore();

  return useQuery({
    queryKey: ["admin", "medicines"],
    queryFn: () => AdminAppService.getAllMedicines(accessToken!),
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDeleteAdminMedicine() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();

  return useMutation({
    mutationFn: (medicineId: string) =>
      AdminAppService.deleteMedicine(accessToken!, medicineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "medicines"] });
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      toast.success("Medicine deleted successfully", {
        description: "The medicine has been removed from the catalog",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to delete medicine", {
        description: error.message || "Please try again later",
      });
    },
  });
}
