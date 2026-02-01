import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null, accessToken?: string | null) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setUser: (user, accessToken = null) =>
        set({
          user,
          accessToken,
          isAuthenticated: !!user,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        }),
      setAccessToken: (token: string) => set({ accessToken: token }),

      clearAuth: () => set({ accessToken: null, user: null }),
    }),
    {
      name: "auth-storage", // localStorage key
    },
  ),
);
