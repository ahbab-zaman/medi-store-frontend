"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";

export function Providers({ children }: { children: React.ReactNode }) {
  const { setAccessToken, setUser, clearAuth, markAuthReady, authReady } =
    useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const persist = useAuthStore.persist;

    if (!persist) {
      setIsHydrated(true);
      return;
    }

    const unsubscribe = persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    if (!persist.hasHydrated()) {
      void persist.rehydrate();
    } else {
      setIsHydrated(true);
    }

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isHydrated || authReady) return;

    const initializeAuth = async () => {
      const currentState = useAuthStore.getState();

      if (currentState.user && currentState.accessToken) {
        markAuthReady();
        return;
      }

      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        const latestState = useAuthStore.getState();
        if (latestState.user && latestState.accessToken) {
          markAuthReady();
          return;
        }

        if (!response.ok) {
          if (!latestState.user && !latestState.accessToken) {
            clearAuth();
          }
          return;
        }

        const userData = await response.json();

        const stateBeforeApply = useAuthStore.getState();
        if (stateBeforeApply.user && stateBeforeApply.accessToken) {
          markAuthReady();
          return;
        }

        if (userData?.accessToken) {
          setAccessToken(userData.accessToken);
        }

        if (userData?.data) {
          setUser(userData.data, userData.accessToken ?? null);
        } else if (!stateBeforeApply.user && !stateBeforeApply.accessToken) {
          clearAuth();
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        const latestState = useAuthStore.getState();
        if (!latestState.user && !latestState.accessToken) {
          clearAuth();
        }
      } finally {
        markAuthReady();
      }
    };

    initializeAuth();
  }, [
    isHydrated,
    authReady,
    setAccessToken,
    setUser,
    clearAuth,
    markAuthReady,
  ]);

  return <>{children}</>;
}
