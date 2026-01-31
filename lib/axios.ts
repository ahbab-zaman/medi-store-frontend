import axios from "axios";
import { useAuthStore } from "@/store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL?.split("/api")[0],
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies (JWT tokens)
});

// Request interceptor - Add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    // Get token from zustand store directly
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      if (status === 401) {
        // Unauthorized - redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }

      // Return structured error
      return Promise.reject({
        message: data?.message || "An error occurred",
        status,
        data,
      });
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({
        message: "Network error. Please check your connection.",
        status: 0,
      });
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message || "An unexpected error occurred",
        status: 0,
      });
    }
  },
);

export default apiClient;
