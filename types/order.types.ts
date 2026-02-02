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
  paymentMethod: string;
  transactionId?: string;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// API request/response types
export interface CreateOrderPayload {
  shippingAddress: string;
  paymentMethod: string;
  transactionId?: string;
  items: {
    medicineId: string;
    quantity: number;
  }[];
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}
