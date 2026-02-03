import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as medicineService from "@/services/medicine.service";
import {
  GetMedicinesParams,
  CreateMedicinePayload,
  UpdateMedicinePayload,
  Medicine,
  ApiResponse,
} from "@/types";
import { toast } from "sonner";

// Fetch all medicines with filters
export function useMedicines(params?: GetMedicinesParams) {
  return useQuery({
    queryKey: ["medicines", params],
    queryFn: () => medicineService.getMedicines(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Fetch single medicine by ID
export function useMedicine(id: string) {
  return useQuery({
    queryKey: ["medicines", id],
    queryFn: () => medicineService.getMedicineById(id),
    enabled: !!id,
  });
}

// Search medicines
export function useSearchMedicines(query: string) {
  return useQuery({
    queryKey: ["medicines", "search", query],
    queryFn: () => medicineService.searchMedicines(query),
    enabled: query.length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Create medicine mutation
export function useCreateMedicine() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Medicine>,
    Error,
    FormData | CreateMedicinePayload
  >({
    mutationFn: medicineService.createMedicine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      toast.success("Medicine created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create medicine");
    },
  });
}

// Update medicine mutation
export function useUpdateMedicine() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Medicine>,
    Error,
    { id: string; data: FormData | UpdateMedicinePayload },
    { previousMedicines?: any; previousMedicine?: any }
  >({
    mutationFn: medicineService.updateMedicine,
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["medicines"] });

      // Snapshot previous data
      const previousMedicines = queryClient.getQueriesData({
        queryKey: ["medicines"],
      });
      const previousMedicine = queryClient.getQueryData(["medicines", id]);

      // Optimistically update lists
      if (!(data instanceof FormData)) {
        queryClient.setQueriesData({ queryKey: ["medicines"] }, (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((med: Medicine) =>
              med.id === id ? { ...med, ...data } : med,
            ),
          };
        });

        queryClient.setQueryData(["medicines", id], (old: any) => {
          if (!old?.data) return old;
          return { ...old, data: { ...old.data, ...data } };
        });
      }

      return { previousMedicines, previousMedicine };
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      queryClient.invalidateQueries({ queryKey: ["medicines", variables.id] });

      toast.success("Medicine updated successfully!");
    },
    onError: (error: any, variables, context) => {
      if (context?.previousMedicines) {
        context.previousMedicines.forEach(([queryKey, data]: [any, any]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousMedicine) {
        queryClient.setQueryData(
          ["medicines", variables.id],
          context.previousMedicine,
        );
      }

      toast.error(error.message || "Failed to update medicine");
    },
  });
}

// Delete medicine mutation
export function useDeleteMedicine() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string, { previousMedicines?: any }>({
    mutationFn: medicineService.deleteMedicine,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["medicines"] });
      const previousMedicines = queryClient.getQueriesData({
        queryKey: ["medicines"],
      });

      // Optimistically remove from lists
      queryClient.setQueriesData({ queryKey: ["medicines"] }, (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((med: Medicine) => med.id !== id),
        };
      });

      return { previousMedicines };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      toast.success("Medicine deleted successfully!");
    },
    onError: (error: any, variables, context) => {
      if (context?.previousMedicines) {
        context.previousMedicines.forEach(([queryKey, data]: [any, any]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(error.message || "Failed to delete medicine");
    },
  });
}
