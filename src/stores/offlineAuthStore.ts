import { create } from "zustand";
import { persist } from "zustand/middleware";

import { UserSession } from "@/types/user-type";

interface OfflineAuthState {
  isOffline: boolean;
  cachedUser: UserSession | null;
  lastLoginTime: number | null;
  offlineSessionValid: boolean;
  hasEverLoggedIn: boolean;

  // Actions
  setOfflineStatus: (status: boolean) => void;
  setCachedUser: (user: UserSession | null) => void;
  setLastLoginTime: (time: number) => void;
  validateOfflineSession: () => boolean;
  clearOfflineAuth: () => void;
  setHasEverLoggedIn: (hasLogged: boolean) => void;
  isAuthRequired: () => boolean;
  isDevMode: () => boolean;
}

const OFFLINE_SESSION_DURATION = 24 * 60 * 60 * 1000;

const getDevMode = (): boolean => {
  return process.env.NEXT_PUBLIC_DEV_MODE === "true";
};

export const useOfflineAuthStore = create<OfflineAuthState>()(
  persist(
    (set, get) => ({
      isOffline: false,
      cachedUser: null,
      lastLoginTime: null,
      offlineSessionValid: false,
      hasEverLoggedIn: false,

      setOfflineStatus: (status: boolean) => {
        set({ isOffline: status });
      },

      setCachedUser: (user: UserSession | null) => {
        set({
          cachedUser: user,
          lastLoginTime: user ? Date.now() : null,
          hasEverLoggedIn: user ? true : get().hasEverLoggedIn,
        });
      },

      setLastLoginTime: (time: number) => {
        set({ lastLoginTime: time });
      },

      setHasEverLoggedIn: (hasLogged: boolean) => {
        set({ hasEverLoggedIn: hasLogged });
      },

      isDevMode: () => {
        return getDevMode();
      },

      isAuthRequired: () => {
        const { hasEverLoggedIn, isOffline, offlineSessionValid } = get();
        const isDevModeActive = getDevMode();

        // console.log("🔍 Verificando se auth é necessária:", {
        //   isDevMode: isDevModeActive,
        //   hasEverLoggedIn,
        //   isOffline,
        //   offlineSessionValid,
        // });

        if (isDevModeActive) {
          console.log("🔧 Modo de desenvolvimento - auth desabilitada");
          return false;
        }

        // Se nunca logou (primeira vez), sempre exige login independente de estar online/offline
        if (!hasEverLoggedIn) {
          console.log("🔐 Primeira vez - login obrigatório (online ou offline)");
          return true;
        }

        // Se já logou antes e está offline com sessão válida, permite acesso
        if (isOffline && offlineSessionValid) {
          console.log("📱 Offline com sessão válida - auth não necessária");
          return false;
        }

        // Se já logou antes e está online, também permite (vai validar com servidor)
        return false;
      },

      validateOfflineSession: () => {
        const { cachedUser, lastLoginTime } = get();

        console.log("🔍 Validando sessão offline:", {
          cachedUser: !!cachedUser,
          lastLoginTime,
        });

        if (!cachedUser || !lastLoginTime) {
          set({ offlineSessionValid: false });
          console.log("❌ Sessão offline inválida: sem usuário ou timestamp");
          return false;
        }

        const now = Date.now();
        const timeDiff = now - lastLoginTime;
        const isValid = timeDiff < OFFLINE_SESSION_DURATION;

        console.log(
          `⏰ Tempo desde último login: ${Math.floor(
            timeDiff / (1000 * 60)
          )} minutos`
        );
        console.log(`✅ Sessão válida: ${isValid}`);

        set({ offlineSessionValid: isValid });

        if (!isValid) {
          console.log("🧹 Limpando sessão expirada");
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
        hasEverLoggedIn: state.hasEverLoggedIn,
      }),
    }
  )
);
