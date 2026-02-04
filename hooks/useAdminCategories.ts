import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminAppService } from "@/services/admin.service";
import { toast } from "sonner";

export function useAdminCategories() {
  return useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => AdminAppService.getAllCategories(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FormData) => AdminAppService.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully", {
        description: "The new category has been added to your store",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to create category", {
        description:
          error.data?.message || error.message || "Please try again later",
      });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormData }) =>
      AdminAppService.updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully", {
        description: "Changes have been saved",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to update category", {
        description:
          error.data?.message || error.message || "Please try again later",
      });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AdminAppService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully", {
        description: "The category has been removed from your store",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to delete category", {
        description:
          error.data?.message || error.message || "Please try again later",
      });
    },
  });
}
