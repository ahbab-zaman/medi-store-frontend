import { useCartStore } from "@/store";
import { Medicine } from "@/types";

// This is a simple wrapper around the Zustand store
// It provides a cleaner API for components
export function useCart() {
  const {
    items,
    totalItems,
    totalAmount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItem,
  } = useCartStore();

  return {
    // State
    items,
    totalItems,
    totalAmount,
    isEmpty: items.length === 0,

    // Actions
    addToCart: (medicine: Medicine, quantity = 1) =>
      addItem(medicine, quantity),
    removeFromCart: (medicineId: string) => removeItem(medicineId),
    updateItemQuantity: (medicineId: string, quantity: number) =>
      updateQuantity(medicineId, quantity),
    clearCart,

    // Helpers
    getCartItem: (medicineId: string) => getItem(medicineId),
    isInCart: (medicineId: string) => !!getItem(medicineId),
  };
}
