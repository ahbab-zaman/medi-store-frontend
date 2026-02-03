import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as categoryService from "@/services/category.service";
import { Category } from "@/types";
import { toast } from "sonner";

// Fetch all categories
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes (categories don't change often)
  });
}

// Fetch single category by ID
export function useCategory(id: string) {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => categoryService.getCategoryById(id),
    enabled: !!id,
  });
}

// Create category mutation
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create category");
    },
  });
}

// Update category mutation
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: string;
      name?: string;
      imageUrl?: string;
    }) => categoryService.updateCategory(id, data),
    onMutate: async ({ id, ...data }) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });

      const previousCategories = queryClient.getQueryData(["categories"]);
      const previousCategory = queryClient.getQueryData(["categories", id]);

      // Optimistic update for list
      queryClient.setQueryData(["categories"], (old: any) => {
        if (!old?.data) return old; // Adjust based on actual API response structure (Category[] or { data: Category[] })
        // Assuming old is Category[] or ApiResponse
        const list = Array.isArray(old) ? old : old.data;
        if (!Array.isArray(list)) return old;

        const updatedList = list.map((cat: Category) =>
          cat.id === id ? { ...cat, ...data } : cat,
        );

        return Array.isArray(old) ? updatedList : { ...old, data: updatedList };
      });

      // Optimistic update for single item
      queryClient.setQueryData(["categories", id], (old: any) => {
        if (!old) return old;
        // Assuming old is Category or { data: Category }
        const cat = old.data || old;
        const updated = { ...cat, ...data };
        return old.data ? { ...old, data: updated } : updated;
      });

      return { previousCategories, previousCategory };
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories", variables.id] });
      toast.success("Category updated successfully!");
    },
    onError: (error: any, variables, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(["categories"], context.previousCategories);
      }
      if (context?.previousCategory) {
        queryClient.setQueryData(
          ["categories", variables.id],
          context.previousCategory,
        );
      }
      toast.error(error.message || "Failed to update category");
    },
  });
}

// Delete category mutation
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.deleteCategory,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });
      const previousCategories = queryClient.getQueryData(["categories"]);

      queryClient.setQueryData(["categories"], (old: any) => {
        if (!old?.data && !Array.isArray(old)) return old;
        const list = Array.isArray(old) ? old : old.data;
        if (!Array.isArray(list)) return old;

        const updatedList = list.filter((cat: Category) => cat.id !== id);
        return Array.isArray(old) ? updatedList : { ...old, data: updatedList };
      });

      return { previousCategories };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully!");
    },
    onError: (error: any, variables, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(["categories"], context.previousCategories);
      }
      toast.error(error.message || "Failed to delete category");
    },
  });
}
