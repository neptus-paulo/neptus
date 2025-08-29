"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect } from "react";

import { useInternetStatus } from "@/hooks/useInternetStatus";
import { useOfflineAuthStore } from "@/stores/offlineAuthStore";

export default function OfflineAuthManager() {
  const { data: session, status } = useSession();
  const { isOnline } = useInternetStatus(); // Mudança aqui
  const { setOfflineStatus, setCachedUser, validateOfflineSession } =
    useOfflineAuthStore();

  const handleOfflineStatus = useCallback(() => {
    setOfflineStatus(!isOnline);
  }, [isOnline, setOfflineStatus]);

  const handleCacheUser = useCallback(() => {
    if (isOnline && status === "authenticated" && session?.user) {
      setCachedUser(session.user);
    }
  }, [isOnline, status, session?.user, setCachedUser]);

  const handleValidateSession = useCallback(() => {
    // Sempre valida a sessão offline quando não está online
    if (!isOnline) {
      const isValid = validateOfflineSession();
      console.log("🔒 Validação sessão offline:", isValid);
    }
  }, [isOnline, validateOfflineSession]);

  // Executa validação inicial na montagem do componente
  useEffect(() => {
    validateOfflineSession();
  }, [validateOfflineSession]);

  useEffect(() => {
    handleOfflineStatus();
  }, [handleOfflineStatus]);

  useEffect(() => {
    handleCacheUser();
  }, [handleCacheUser]);

  useEffect(() => {
    handleValidateSession();
  }, [handleValidateSession]);

  return null;
}
export function useAuthState() {
  const { data: session, status } = useSession();
  const { isOnline } = useInternetStatus(); // Mudança aqui também
  const { cachedUser, offlineSessionValid, isOffline } = useOfflineAuthStore();

  if (isOnline) {
    return {
      isAuthenticated: status === "authenticated",
      user: session?.user || null,
      isLoading: status === "loading",
      isOffline: false,
    };
  }

  return {
    isAuthenticated: offlineSessionValid && cachedUser !== null,
    user: offlineSessionValid ? cachedUser : null,
    isLoading: false,
    isOffline: true,
  };
}
