import { Medicine } from "./medicine.types";

export interface WishlistItem {
  id: string;
  userId: string;
  medicineId: string;
  medicine: Medicine;
  createdAt: string;
}

export interface WishlistResponse {
  id: string;
  userId: string;
  medicineId: string;
  medicine: Medicine;
  createdAt: string;
}
