"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useOfflineAuthStore } from "@/stores/offlineAuthStore";

/**
 * Component to manage offline authentication state
 * Caches user session when online and provides offline access
 */
export default function OfflineAuthManager() {
  const { data: session, status } = useSession();
  const isOnline = useOnlineStatus();
  const {
    setOfflineStatus,
    setCachedUser,
    validateOfflineSession,
    offlineSessionValid,
  } = useOfflineAuthStore();

  // Update offline status
  useEffect(() => {
    setOfflineStatus(!isOnline);
  }, [isOnline, setOfflineStatus]);

  // Cache user session when online and authenticated
  useEffect(() => {
    if (isOnline && status === "authenticated" && session?.user) {
      setCachedUser(session.user);
    }
  }, [isOnline, status, session, setCachedUser]);

  // Validate offline session when offline
  useEffect(() => {
    if (!isOnline) {
      validateOfflineSession();
    }
  }, [isOnline, validateOfflineSession]);

  // This component doesn't render anything visible
  return null;
}

/**
 * Hook to get current authentication state (online or offline)
 */
export function useAuthState() {
  const { data: session, status } = useSession();
  const isOnline = useOnlineStatus();
  const { cachedUser, offlineSessionValid, isOffline } = useOfflineAuthStore();

  if (isOnline) {
    return {
      isAuthenticated: status === "authenticated",
      user: session?.user || null,
      isLoading: status === "loading",
      isOffline: false,
    };
  }

  // Offline state
  return {
    isAuthenticated: offlineSessionValid && cachedUser !== null,
    user: offlineSessionValid ? cachedUser : null,
    isLoading: false,
    isOffline: true,
  };
}
