import { User } from "./user.types";

// Category types
export interface Category {
  id: string;
  name: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Medicine types
export interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  manufacturer: string;
  expiryDate?: string | null;
  imageUrl?: string | null;
  categoryId: string;
  category?: Category;
  sellerId: string;
  seller?: User;
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
}

// Review types
export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  user?: User;
  medicineId: string;
  medicine?: Medicine;
  createdAt: string;
  updatedAt: string;
}

// API request/response types
export interface GetMedicinesParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price" | "name" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface CreateMedicinePayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  manufacturer: string;
  expiryDate?: string;
  imageUrl?: string;
  categoryId: string;
}

export interface UpdateMedicinePayload extends Partial<CreateMedicinePayload> {
  id: string;
}

export interface CreateReviewPayload {
  rating: number;
  comment: string;
  medicineId: string;
}
