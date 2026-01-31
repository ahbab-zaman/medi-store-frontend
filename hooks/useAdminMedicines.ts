import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminAppService } from "@/services/admin.service";
import { useAuthStore } from "@/store";
import { useUIStore } from "@/store";

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
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: (medicineId: string) =>
      AdminAppService.deleteMedicine(accessToken!, medicineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "medicines"] });
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      addNotification({
        type: "success",
        message: "Medicine deleted successfully",
      });
    },
    onError: (error: any) => {
      addNotification({
        type: "error",
        message: error.message || "Failed to delete medicine",
      });
    },
  });
}
