"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "@/store/cart.store";
import { Medicine } from "@/types";
import { cartService } from "@/services/cart.service";
import { useAuth } from "./useAuth";

export function useCart() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const {
    items: localItems,
    totalItems: localTotalItems,
    totalAmount: localTotalAmount,
    addItem: addLocalItem,
    removeItem: removeLocalItem,
    updateQuantity: updateLocalQuantity,
    clearCart: clearLocalCart,
    getItem,
  } = useCartStore();

  // Fetch cart from backend if user is logged in
  const { data: backendCart } = useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
    enabled: !!user,
    retry: false,
  });

  // Use backend cart if available, otherwise use local cart
  const items = backendCart?.items || localItems;
  const totalItems = backendCart?.totalItems || localTotalItems;
  const totalAmount = backendCart?.totalAmount || localTotalAmount;

  // Add to cart mutation
  const addMutation = useMutation({
    mutationFn: (payload: { medicineId: string; quantity: number }) =>
      cartService.addToCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Update cart item mutation
  const updateMutation = useMutation({
    mutationFn: (payload: { medicineId: string; quantity: number }) =>
      cartService.updateCartItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Remove from cart mutation
  const removeMutation = useMutation({
    mutationFn: (medicineId: string) => cartService.removeFromCart(medicineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Clear cart mutation
  const clearMutation = useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Add to cart function
  const addToCart = async (medicine: Medicine, quantity = 1) => {
    if (user) {
      // If logged in, use backend
      await addMutation.mutateAsync({
        medicineId: medicine.id,
        quantity,
      });
    } else {
      // If not logged in, use local storage
      addLocalItem(medicine, quantity);
    }
  };

  // Update item quantity function
  const updateItemQuantity = async (medicineId: string, quantity: number) => {
    if (user) {
      // If logged in, use backend
      await updateMutation.mutateAsync({
        medicineId,
        quantity,
      });
    } else {
      // If not logged in, use local storage
      updateLocalQuantity(medicineId, quantity);
    }
  };

  // Remove from cart function
  const removeFromCart = async (medicineId: string) => {
    if (user) {
      // If logged in, use backend
      await removeMutation.mutateAsync(medicineId);
    } else {
      // If not logged in, use local storage
      removeLocalItem(medicineId);
    }
  };

  // Clear cart function
  const clearCart = async () => {
    if (user) {
      // If logged in, use backend
      await clearMutation.mutateAsync();
    } else {
      // If not logged in, use local storage
      clearLocalCart();
    }
  };

  return {
    // State
    items,
    totalItems,
    totalAmount,
    isEmpty: items.length === 0,

    // Actions
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,

    // Helpers
    getCartItem: (medicineId: string) => getItem(medicineId),
    isInCart: (medicineId: string) => !!getItem(medicineId),

    // Loading states
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
    isClearing: clearMutation.isPending,
  };
}
