import axios from "axios";
import { WishlistItem } from "@/types";

const wishlistClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const getWishlist = async (): Promise<WishlistItem[]> => {
  const response = await wishlistClient.get("/api/wishlist");
  return response.data.data;
};

export const addToWishlist = async (medicineId: string): Promise<WishlistItem> => {
  const response = await wishlistClient.post("/api/wishlist/add", { medicineId });
  return response.data.data;
};

export const removeFromWishlist = async (medicineId: string): Promise<void> => {
  await wishlistClient.delete(`/api/wishlist/remove/${medicineId}`);
};

export const wishlistService = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
