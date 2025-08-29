"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import LoadingFullScreen from "@/components/LoadingFullScreen";
import { useInternetConnection } from "@/hooks/useInternetConnection";
import { useOfflineAuthStore } from "@/stores/offlineAuthStore";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { isOnline } = useInternetConnection();
  const { cachedUser, validateOfflineSession } = useOfflineAuthStore();
  const [canAccess, setCanAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccess = () => {
      console.log("🔍 AuthGuard verificando acesso:", {
        status,
        isOnline,
        hasSession: !!session,
        hasCachedUser: !!cachedUser,
      });

      // Se ainda está carregando, espera
      if (status === "loading") {
        return;
      }

      // Se está online e autenticado, permite
      if (isOnline && status === "authenticated") {
        console.log("✅ Online e autenticado");
        setCanAccess(true);
        setIsChecking(false);
        return;
      }

      // Se está offline, verifica cache
      if (!isOnline) {
        const hasValidCache = validateOfflineSession();
        console.log("📱 Offline - cache válido:", hasValidCache);
        
        if (hasValidCache) {
          setCanAccess(true);
          setIsChecking(false);
          return;
        }
      }

      // Se está online mas não autenticado, vai para login
      if (isOnline && status === "unauthenticated") {
        console.log("🔒 Não autenticado, indo para login");
        router.push("/login");
        return;
      }

      // Fallback: se offline e sem cache válido, vai para login
      console.log("❌ Sem acesso válido, indo para login");
      router.push("/login");
    };

    checkAccess();
  }, [status, session, isOnline, cachedUser, router, validateOfflineSession]);

  if (isChecking) {
    return <LoadingFullScreen />;
  }

  if (!canAccess) {
    return <LoadingFullScreen />;
  }

  return <>{children}</>;
}
