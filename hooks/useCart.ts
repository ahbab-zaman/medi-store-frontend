"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "@/store/cart.store";
import { Medicine } from "@/types";
import { cartService } from "@/services/cart.service";
import { useAuth } from "./useAuth";
import { Cart, CartItem } from "@/types/cart.types";
import { toast } from "sonner";

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
  const { data: backendCart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
    enabled: !!user,
    retry: false,
  });

  // Use backend cart if available, otherwise use local cart
  const items = backendCart?.items || localItems;
  const totalItems = backendCart?.totalItems || localTotalItems;
  const totalAmount = backendCart?.totalAmount || localTotalAmount;

  // Add to cart mutation with Optimistic Update
  const addMutation = useMutation({
    mutationFn: (payload: { medicine: Medicine; quantity: number }) =>
      cartService.addToCart({
        medicineId: payload.medicine.id,
        quantity: payload.quantity,
      }),
    onMutate: async ({ medicine, quantity }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData<Cart>(["cart"]);

      // Optimistically update to the new value
      queryClient.setQueryData<Cart>(["cart"], (old) => {
        if (!old) return old;

        const existingItemIndex = old.items.findIndex(
          (item) => item.medicineId === medicine.id,
        );

        let newItems = [...old.items];
        let newTotalItems = old.totalItems + quantity;
        let newTotalAmount = old.totalAmount + (medicine.price || 0) * quantity;

        if (existingItemIndex > -1) {
          // Update existing item
          const existingItem = newItems[existingItemIndex];
          newItems[existingItemIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + quantity,
          };
        } else {
          // Add new item
          const newItem: CartItem = {
            medicineId: medicine.id,
            medicine: medicine,
            quantity: quantity,
          };
          newItems.push(newItem);
        }

        return {
          ...old,
          items: newItems,
          totalItems: newTotalItems,
          totalAmount: newTotalAmount,
        };
      });

      // Return a context object with the snapshotted value
      return { previousCart };
    },
    onError: (err, newTodo, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      toast.error("Failed to add to cart");
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Update cart item mutation with Optimistic Update
  const updateMutation = useMutation({
    mutationFn: (payload: { medicineId: string; quantity: number }) =>
      cartService.updateCartItem(payload),
    onMutate: async ({ medicineId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData<Cart>(["cart"]);

      queryClient.setQueryData<Cart>(["cart"], (old) => {
        if (!old) return old;

        const existingItemIndex = old.items.findIndex(
          (item) => item.medicineId === medicineId,
        );

        if (existingItemIndex === -1) return old;

        const existingItem = old.items[existingItemIndex];
        const quantityDiff = quantity - existingItem.quantity;
        const price = existingItem.medicine.price || 0;

        let newItems = [...old.items];
        newItems[existingItemIndex] = {
          ...existingItem,
          quantity: quantity,
        };

        return {
          ...old,
          items: newItems,
          totalItems: old.totalItems + quantityDiff,
          totalAmount: old.totalAmount + price * quantityDiff,
        };
      });

      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      toast.error("Failed to update cart");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Remove from cart mutation with Optimistic Update
  const removeMutation = useMutation({
    mutationFn: (medicineId: string) => cartService.removeFromCart(medicineId),
    onMutate: async (medicineId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData<Cart>(["cart"]);

      queryClient.setQueryData<Cart>(["cart"], (old) => {
        if (!old) return old;

        const itemToRemove = old.items.find(
          (item) => item.medicineId === medicineId,
        );
        if (!itemToRemove) return old;

        const newItems = old.items.filter(
          (item) => item.medicineId !== medicineId,
        );

        return {
          ...old,
          items: newItems,
          totalItems: old.totalItems - itemToRemove.quantity,
          totalAmount:
            old.totalAmount -
            (itemToRemove.medicine.price || 0) * itemToRemove.quantity,
        };
      });

      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      toast.error("Failed to remove from cart");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Clear cart mutation
  const clearMutation = useMutation({
    mutationFn: cartService.clearCart,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData<Cart>(["cart"]);

      queryClient.setQueryData<Cart>(["cart"], (old) => {
        if (!old) return old;
        return {
          ...old,
          items: [],
          totalItems: 0,
          totalAmount: 0,
        };
      });

      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      toast.error("Failed to clear cart");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Add to cart function
  const addToCart = async (medicine: Medicine, quantity = 1) => {
    if (user) {
      // If logged in, use backend (mutation handles optimistic update)
      // Note: we pass medicine object to mutation for optimistic update logic
      await addMutation.mutateAsync({
        medicine,
        quantity,
      });
    } else {
      // If not logged in, use local storage
      addLocalItem(medicine, quantity);
      toast.success("Added to cart");
    }
  };

  // Update item quantity function
  const updateItemQuantity = async (medicineId: string, quantity: number) => {
    if (user) {
      await updateMutation.mutateAsync({
        medicineId,
        quantity,
      });
    } else {
      updateLocalQuantity(medicineId, quantity);
    }
  };

  // Remove from cart function
  const removeFromCart = async (medicineId: string) => {
    if (user) {
      await removeMutation.mutateAsync(medicineId);
    } else {
      removeLocalItem(medicineId);
    }
  };

  // Clear cart function
  const clearCart = async () => {
    if (user) {
      await clearMutation.mutateAsync();
    } else {
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

    // Loading states - mostly for specific feedback if needed,
    // but optimistic updates make UI feel instant.
    isLoading,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
    isClearing: clearMutation.isPending,
  };
}
