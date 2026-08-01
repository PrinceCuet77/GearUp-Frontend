import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/lib/types';
import { getProfileAction } from '@/app/(auth)/_actions/getProfileActions';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) =>
        set({ user, isAuthenticated: !!user, isLoading: false }),

      fetchUser: async () => {
        // Avoid redundant fetches if we already have a user
        if (get().user) {
          set({ isLoading: false });
          return;
        }
        set({ isLoading: true });
        try {
          const profile = await getProfileAction();
          if (profile) {
            set({
              user: profile as User,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      clearUser: () =>
        set({ user: null, isAuthenticated: false, isLoading: false }),
    }),
    {
      name: 'gearup-auth',
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
