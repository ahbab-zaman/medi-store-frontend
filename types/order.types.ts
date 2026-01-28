import { OrderStatus } from "./user.types";
import { Medicine } from "./medicine.types";

// Order Item types
export interface OrderItem {
  id: string;
  orderId: string;
  medicineId: string;
  medicine?: Medicine;
  quantity: number;
  price: number;
}

// Order types
export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  paymentStatus: string;
  orderItems?: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// Cart types (client-side only, not in database)
export interface CartItem {
  medicineId: string;
  medicine: Medicine;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

// API request/response types
export interface CreateOrderPayload {
  shippingAddress: string;
  items: {
    medicineId: string;
    quantity: number;
    price: number;
  }[];
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}
