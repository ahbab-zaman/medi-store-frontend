"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWishlistStore } from "@/store/wishlist.store";
import { Medicine, WishlistItem } from "@/types";
import { wishlistService } from "@/services/wishlist.service";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useWishlist() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const {
    items: localItems,
    addItem: addLocalItem,
    removeItem: removeLocalItem,
  } = useWishlistStore();

  // Fetch wishlist from backend if user is logged in
  const { data: backendWishlist, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistService.getWishlist,
    enabled: !!user,
    retry: false,
  });

  // Use backend wishlist if available, otherwise use local wishlist
  const items = backendWishlist || localItems;

  // Add to wishlist mutation with Optimistic Update
  const addMutation = useMutation({
    mutationFn: (medicine: Medicine) => wishlistService.addToWishlist(medicine.id),
    onMutate: async (medicine) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      const previousWishlist = queryClient.getQueryData<WishlistItem[]>(["wishlist"]);

      queryClient.setQueryData<WishlistItem[]>(["wishlist"], (old) => {
        if (!old) return [{ id: "temp", userId: user?.id || "", medicineId: medicine.id, medicine, createdAt: new Date().toISOString() }];
        const exists = old.some((item) => item.medicineId === medicine.id);
        if (exists) return old;
        return [
          {
            id: "temp-" + Date.now(),
            userId: user?.id || "",
            medicineId: medicine.id,
            medicine,
            createdAt: new Date().toISOString(),
          },
          ...old,
        ];
      });

      return { previousWishlist };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Added to wishlist");
    },
    onError: (err, variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(["wishlist"], context.previousWishlist);
      }
      toast.error("Failed to add to wishlist");
    },
  });

  // Remove from wishlist mutation with Optimistic Update
  const removeMutation = useMutation({
    mutationFn: (medicineId: string) => wishlistService.removeFromWishlist(medicineId),
    onMutate: async (medicineId) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      const previousWishlist = queryClient.getQueryData<WishlistItem[]>(["wishlist"]);

      queryClient.setQueryData<WishlistItem[]>(["wishlist"], (old) => {
        if (!old) return [];
        return old.filter((item) => item.medicineId !== medicineId);
      });

      return { previousWishlist };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Removed from wishlist");
    },
    onError: (err, variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(["wishlist"], context.previousWishlist);
      }
      toast.error("Failed to remove from wishlist");
    },
  });

  const toggleWishlist = async (medicine: Medicine) => {
    const isFav = items.some((item) => item.medicineId === medicine.id);
    if (user) {
      if (isFav) {
        await removeMutation.mutateAsync(medicine.id);
      } else {
        await addMutation.mutateAsync(medicine);
      }
    } else {
      if (isFav) {
        removeLocalItem(medicine.id);
        toast.success("Removed from wishlist");
      } else {
        addLocalItem({
          id: "local-" + Date.now(),
          userId: "local",
          medicineId: medicine.id,
          medicine,
          createdAt: new Date().toISOString(),
        });
        toast.success("Added to wishlist");
      }
    }
  };

  const isInWishlist = (medicineId: string) => {
    return items.some((item) => item.medicineId === medicineId);
  };

  return {
    items,
    isLoading,
    toggleWishlist,
    isInWishlist,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
}
