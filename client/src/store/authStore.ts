import { create } from "zustand";
import { logoutRequest, meRequest } from "@/lib/auth";
import type { User } from "@/types";

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isHydrated: boolean;
  setUser: (user: User | null) => void;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isHydrated: false,
  setUser: (user) => set({ user }),
  hydrate: async () => {
    set({ isLoading: true });
    try {
      const user = await meRequest();
      set({ user, isHydrated: true, isLoading: false });
    } catch {
      set({ user: null, isHydrated: true, isLoading: false });
    }
  },
  logout: async () => {
    await logoutRequest();
    set({ user: null, isHydrated: true, isLoading: false });
  },
}));