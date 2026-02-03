import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminAppService } from "@/services/admin.service";
import { toast } from "sonner";

export function useAdminMedicines() {
  return useQuery({
    queryKey: ["admin", "medicines"],
    queryFn: () => AdminAppService.getAllMedicines(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDeleteAdminMedicine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (medicineId: string) =>
      AdminAppService.deleteMedicine(medicineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "medicines"] });
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      toast.success("Medicine deleted successfully", {
        description: "The medicine has been removed from the catalog",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to delete medicine", {
        description:
          error.data?.message || error.message || "Please try again later",
      });
    },
  });
}
