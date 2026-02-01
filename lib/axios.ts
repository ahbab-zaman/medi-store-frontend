import axios, { InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth.store";
import {
  isTokenExpiringSoon,
  refreshAccessToken,
} from "@/utils/auth/tokenManager.client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL?.split("/api")[0],
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Track if we're currently refreshing
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      // Check if token is expiring soon
      if (isTokenExpiringSoon(token, 60)) {
        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const newToken = await refreshAccessToken();

            if (newToken) {
              useAuthStore.getState().setAccessToken(newToken);
              config.headers.Authorization = `Bearer ${newToken}`;
              processQueue(null, newToken);
            } else {
              processQueue(new Error("Token refresh failed"), null);
            }
          } catch (error) {
            processQueue(error, null);
          } finally {
            isRefreshing = false;
          }
        } else {
          // Wait for ongoing refresh
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            config.headers.Authorization = `Bearer ${token}`;
            return config;
          });
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // FormData handling
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 with retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken();

          if (newToken) {
            useAuthStore.getState().setAccessToken(newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            processQueue(null, newToken);
            return apiClient(originalRequest);
          } else {
            // Refresh failed - clear auth and redirect
            useAuthStore.getState().clearAuth();
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
            processQueue(new Error("Authentication failed"), null);
            return Promise.reject(error);
          }
        } catch (refreshError) {
          useAuthStore.getState().clearAuth();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          processQueue(refreshError, null);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // Queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }
    }

    // Handle other errors
    if (error.response) {
      return Promise.reject({
        message: error.response.data?.message || "An error occurred",
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      return Promise.reject({
        message: "Network error. Please check your connection.",
        status: 0,
      });
    }

    return Promise.reject({
      message: error.message || "An unexpected error occurred",
      status: 0,
    });
  },
);

export default apiClient;
