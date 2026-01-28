import { create } from "zustand";

interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}

interface Modal {
  id: string;
  isOpen: boolean;
  data?: unknown;
}

interface UIState {
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;

  // Modals
  modals: Record<string, Modal>;
  openModal: (id: string, data?: unknown) => void;
  closeModal: (id: string) => void;

  // Loading states
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Notifications
  notifications: [],

  addNotification: (notification) => {
    const id = Math.random().toString(36).substring(7);
    const newNotification = { ...notification, id };

    set({ notifications: [...get().notifications, newNotification] });

    // Auto-remove after duration (default 5 seconds)
    const duration = notification.duration || 5000;
    setTimeout(() => {
      get().removeNotification(id);
    }, duration);
  },

  removeNotification: (id) => {
    set({
      notifications: get().notifications.filter((n) => n.id !== id),
    });
  },

  // Modals
  modals: {},

  openModal: (id, data) => {
    set({
      modals: {
        ...get().modals,
        [id]: { id, isOpen: true, data },
      },
    });
  },

  closeModal: (id) => {
    set({
      modals: {
        ...get().modals,
        [id]: { ...get().modals[id], isOpen: false },
      },
    });
  },

  // Loading states
  globalLoading: false,

  setGlobalLoading: (loading) => {
    set({ globalLoading: loading });
  },
}));
