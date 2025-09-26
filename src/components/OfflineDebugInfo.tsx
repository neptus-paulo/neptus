 
"use client";

import { useEffect, useState } from "react";

import { useAuthState } from "@/components/OfflineAuthManager";
import { useInternetConnection } from "@/hooks/useInternetConnection";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useOfflineAuthStore } from "@/stores/offlineAuthStore";

export default function OfflineDebugInfo() {
  const [isVisible, setIsVisible] = useState(false);
  const { isOnline: internetOnline } = useInternetConnection();
  const { isOnline: esp32Online } = useOnlineStatus();
  const authState = useAuthState();
  const {
    cachedUser,
    lastLoginTime,
    offlineSessionValid,
    isOffline,
    validateOfflineSession,
  } = useOfflineAuthStore();

  useEffect(() => {
    // Mostra apenas em development
    if (process.env.NODE_ENV === "development") {
      setIsVisible(true);
    }
  }, []);

  const handleForceValidation = () => {
    const result = validateOfflineSession();
    console.log("🔄 Validação forçada:", result);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white text-xs p-3 rounded-lg max-w-xs z-50">
      <div className="mb-2 font-bold">Debug Offline</div>
      
      <div className="space-y-1">
        <div>🌐 Internet: {internetOnline ? "✅" : "❌"}</div>
        <div>🔌 ESP32: {esp32Online ? "✅" : "❌"}</div>
        <div>📶 Navigator: {navigator?.onLine ? "✅" : "❌"}</div>
        <div>📱 Is Offline: {isOffline ? "✅" : "❌"}</div>
        <div>🔐 Auth Valid: {authState.isAuthenticated ? "✅" : "❌"}</div>
        <div>⏱️ Offline Valid: {offlineSessionValid ? "✅" : "❌"}</div>
        <div>👤 Cached User: {cachedUser ? "✅" : "❌"}</div>
        <div>⏳ Is Loading: {authState.isLoading ? "✅" : "❌"}</div>
        {lastLoginTime && (
          <div>🕐 Login: {new Date(lastLoginTime).toLocaleTimeString()}</div>
        )}
      </div>

      <button
        onClick={handleForceValidation}
        className="mt-2 bg-blue-600 px-2 py-1 rounded text-xs"
      >
        Validar Sessão
      </button>
    </div>
  );
}
