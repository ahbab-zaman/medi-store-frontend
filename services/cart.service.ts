import axios from "axios";
import {
  CartResponse,
  AddToCartPayload,
  UpdateCartItemPayload,
  SyncCartPayload,
} from "@/types";

// Use standard axios for Next.js API routes
const cartClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Get user's cart
export const getCart = async (): Promise<CartResponse> => {
  const response = await cartClient.get("/api/cart");
  return response.data.data;
};

// Add item to cart
export const addToCart = async (
  payload: AddToCartPayload,
): Promise<CartResponse> => {
  const response = await cartClient.post("/api/cart/add", payload);
  return response.data.data;
};

// Update cart item quantity
export const updateCartItem = async (
  payload: UpdateCartItemPayload,
): Promise<CartResponse> => {
  const response = await cartClient.put("/api/cart/update", payload);
  return response.data.data;
};

// Remove item from cart
export const removeFromCart = async (
  medicineId: string,
): Promise<CartResponse> => {
  const response = await cartClient.delete(`/api/cart/remove/${medicineId}`);
  return response.data.data;
};

// Clear cart
export const clearCart = async (): Promise<CartResponse> => {
  const response = await cartClient.delete("/api/cart/clear");
  return response.data.data;
};

// Sync cart with backend
export const syncCart = async (
  payload: SyncCartPayload,
): Promise<CartResponse> => {
  const response = await cartClient.post("/api/cart/sync", payload);
  return response.data.data;
};

export const cartService = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  syncCart,
};
