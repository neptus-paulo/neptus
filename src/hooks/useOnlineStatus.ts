"use client";

import { useEffect, useState } from "react";

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Verificar status inicial
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Adicionar listeners
    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    // Cleanup
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      }
    };
  }, []);

  return isOnline;
};
