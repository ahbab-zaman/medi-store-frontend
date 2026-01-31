import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminAppService } from "@/services/admin.service";
import { useAuthStore } from "@/store";
import { useUIStore } from "@/store";

export function useAdminCategories() {
  return useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => AdminAppService.getAllCategories(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: (formData: FormData) =>
      AdminAppService.createCategory(accessToken!, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      addNotification({
        type: "success",
        message: "Category created successfully",
      });
    },
    onError: (error: any) => {
      addNotification({
        type: "error",
        message: error.message || "Failed to create category",
      });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      AdminAppService.updateCategory(accessToken!, id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      addNotification({
        type: "success",
        message: "Category updated successfully",
      });
    },
    onError: (error: any) => {
      addNotification({
        type: "error",
        message: error.message || "Failed to update category",
      });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: (id: string) =>
      AdminAppService.deleteCategory(accessToken!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      addNotification({
        type: "success",
        message: "Category deleted successfully",
      });
    },
    onError: (error: any) => {
      addNotification({
        type: "error",
        message: error.message || "Failed to delete category",
      });
    },
  });
}
