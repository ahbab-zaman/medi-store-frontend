import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUIStore } from "@/store";
import * as medicineService from "@/services/medicine.service";
import {
  GetMedicinesParams,
  CreateMedicinePayload,
  UpdateMedicinePayload,
} from "@/types";

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
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: medicineService.createMedicine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      addNotification({
        type: "success",
        message: "Medicine created successfully!",
      });
    },
    onError: (error: any) => {
      addNotification({
        type: "error",
        message: error.message || "Failed to create medicine",
      });
    },
  });
}

// Update medicine mutation
export function useUpdateMedicine() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: medicineService.updateMedicine,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      queryClient.invalidateQueries({ queryKey: ["medicines", variables.id] });
      addNotification({
        type: "success",
        message: "Medicine updated successfully!",
      });
    },
    onError: (error: any) => {
      addNotification({
        type: "error",
        message: error.message || "Failed to update medicine",
      });
    },
  });
}

// Delete medicine mutation
export function useDeleteMedicine() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: medicineService.deleteMedicine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      addNotification({
        type: "success",
        message: "Medicine deleted successfully!",
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
