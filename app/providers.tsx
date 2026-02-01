"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { fetchAccessTokenFromServer } from "@/utils/auth/tokenManager.client";

export function Providers({ children }: { children: React.ReactNode }) {
  const { setAccessToken, setUser, clearAuth } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get access token from server (stored in httpOnly cookie)
        const token = await fetchAccessTokenFromServer();

        if (token) {
          // Store in Zustand for axios to use
          setAccessToken(token);

          // Fetch user data
          const userResponse = await fetch("/api/auth/me", {
            credentials: "include",
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            if (userData?.data) {
              setUser(userData.data);
            }
          }
        } else {
          // No token - user not authenticated
          clearAuth();
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        clearAuth();
      }
    };

    initializeAuth();
  }, [setAccessToken, setUser, clearAuth]);

  return <>{children}</>;
}
