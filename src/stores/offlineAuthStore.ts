import { create } from "zustand";
import { persist } from "zustand/middleware";

import { UserSession } from "@/types/user-type";

interface OfflineAuthState {
  isOffline: boolean;
  cachedUser: UserSession | null;
  lastLoginTime: number | null;
  offlineSessionValid: boolean;

  // Actions
  setOfflineStatus: (status: boolean) => void;
  setCachedUser: (user: UserSession | null) => void;
  setLastLoginTime: (time: number) => void;
  validateOfflineSession: () => boolean;
  clearOfflineAuth: () => void;
}

const OFFLINE_SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const useOfflineAuthStore = create<OfflineAuthState>()(
  persist(
    (set, get) => ({
      isOffline: false,
      cachedUser: null,
      lastLoginTime: null,
      offlineSessionValid: false,

      setOfflineStatus: (status: boolean) => {
        set({ isOffline: status });
      },

      setCachedUser: (user: UserSession | null) => {
        set({
          cachedUser: user,
          lastLoginTime: user ? Date.now() : null,
        });
      },

      setLastLoginTime: (time: number) => {
        set({ lastLoginTime: time });
      },

      validateOfflineSession: () => {
        const { cachedUser, lastLoginTime } = get();

        console.log("🔍 Validando sessão offline:", { cachedUser: !!cachedUser, lastLoginTime });

        if (!cachedUser || !lastLoginTime) {
          set({ offlineSessionValid: false });
          console.log("❌ Sessão offline inválida: sem usuário ou timestamp");
          return false;
        }

        const now = Date.now();
        const timeDiff = now - lastLoginTime;
        const isValid = timeDiff < OFFLINE_SESSION_DURATION;

        console.log(`⏰ Tempo desde último login: ${Math.floor(timeDiff / (1000 * 60))} minutos`);
        console.log(`✅ Sessão válida: ${isValid}`);

        set({ offlineSessionValid: isValid });

        if (!isValid) {
          console.log("🧹 Limpando sessão expirada");
          // Clear expired session
          set({
            cachedUser: null,
            lastLoginTime: null,
          });
        }

        return isValid;
      },

      clearOfflineAuth: () => {
        set({
          cachedUser: null,
          lastLoginTime: null,
          offlineSessionValid: false,
        });
      },
    }),
    {
      name: "offline-auth-storage",
      partialize: (state) => ({
        cachedUser: state.cachedUser,
        lastLoginTime: state.lastLoginTime,
        offlineSessionValid: state.offlineSessionValid,
      }),
    },
  ),
);
