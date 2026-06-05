import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WishlistItem } from "@/types";

interface WishlistState {
  items: WishlistItem[];
  
  // Actions
  setItems: (items: WishlistItem[]) => void;
  addItem: (item: WishlistItem) => void;
  removeItem: (medicineId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (medicineId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      
      setItems: (items) => set({ items }),
      
      addItem: (item) => {
        const items = get().items;
        const exists = items.some((i) => i.medicineId === item.medicineId);
        if (!exists) {
          set({ items: [...items, item] });
        }
      },
      
      removeItem: (medicineId) => {
        set({
          items: get().items.filter((item) => item.medicineId !== medicineId),
        });
      },
      
      clearWishlist: () => set({ items: [] }),
      
      isInWishlist: (medicineId) => {
        return get().items.some((item) => item.medicineId === medicineId);
      },
    }),
    {
      name: "wishlist-storage",
    },
  ),
);
