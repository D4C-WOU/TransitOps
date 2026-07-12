import { create } from "zustand";
import { logoutRequest, meRequest } from "@/lib/auth";
import type { User } from "@/types";

type AuthState = {
  user: User | null;
  isHydrated: boolean;
  setUser: (user: User | null) => void;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isHydrated: false,
  setUser: (user) => set({ user, isHydrated: true }),
  hydrate: async () => {
    try {
      const user = await meRequest();
      set({ user, isHydrated: true });
    } catch {
      set({ user: null, isHydrated: true });
    }
  },
  logout: async () => {
    await logoutRequest();
    set({ user: null, isHydrated: true });
  },
}));