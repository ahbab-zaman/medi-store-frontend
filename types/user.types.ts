// Enums from Prisma schema
export enum Role {
  CUSTOMER = "CUSTOMER",
  SELLER = "SELLER",
  ADMIN = "ADMIN",
}

export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  contactNumber?: string | null;
  address?: string | null;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  contactNumber?: string;
  address?: string;
}

// Auth types
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: Role;
  contactNumber?: string;
  address?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    accessToken?: string;
  };
}

export interface MeResponse {
  success: boolean;
  data: User;
}
