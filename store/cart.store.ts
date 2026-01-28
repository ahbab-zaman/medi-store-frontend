import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Medicine } from "@/types";

interface CartState {
  items: CartItem[];

  // Computed values
  totalItems: number;
  totalAmount: number;

  // Actions
  addItem: (medicine: Medicine, quantity?: number) => void;
  removeItem: (medicineId: string) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  clearCart: () => void;

  // Helper
  getItem: (medicineId: string) => CartItem | undefined;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalAmount: 0,

      addItem: (medicine, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.medicineId === medicine.id,
        );

        let newItems: CartItem[];

        if (existingItem) {
          // Update quantity if item already exists
          newItems = items.map((item) =>
            item.medicineId === medicine.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        } else {
          // Add new item
          newItems = [
            ...items,
            { medicineId: medicine.id, medicine, quantity },
          ];
        }

        // Calculate totals
        const totalItems = newItems.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        const totalAmount = newItems.reduce(
          (sum, item) => sum + item.medicine.price * item.quantity,
          0,
        );

        set({ items: newItems, totalItems, totalAmount });
      },

      removeItem: (medicineId) => {
        const newItems = get().items.filter(
          (item) => item.medicineId !== medicineId,
        );

        const totalItems = newItems.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        const totalAmount = newItems.reduce(
          (sum, item) => sum + item.medicine.price * item.quantity,
          0,
        );

        set({ items: newItems, totalItems, totalAmount });
      },

      updateQuantity: (medicineId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(medicineId);
          return;
        }

        const newItems = get().items.map((item) =>
          item.medicineId === medicineId ? { ...item, quantity } : item,
        );

        const totalItems = newItems.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        const totalAmount = newItems.reduce(
          (sum, item) => sum + item.medicine.price * item.quantity,
          0,
        );

        set({ items: newItems, totalItems, totalAmount });
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, totalAmount: 0 });
      },

      getItem: (medicineId) => {
        return get().items.find((item) => item.medicineId === medicineId);
      },
    }),
    {
      name: "cart-storage", // localStorage key
    },
  ),
);
