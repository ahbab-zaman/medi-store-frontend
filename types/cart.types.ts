import { Medicine } from "./medicine.types";

// Cart types (client-side and backend)
export interface CartItem {
  id?: string;
  medicineId: string;
  medicine: Medicine;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Cart {
  id?: string;
  userId?: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  createdAt?: string;
  updatedAt?: string;
}

// API request/response types
export interface AddToCartPayload {
  medicineId: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  medicineId: string;
  quantity: number;
}

export interface SyncCartPayload {
  items: {
    medicineId: string;
    quantity: number;
  }[];
}

export interface CartResponse {
  id: string;
  userId: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}
