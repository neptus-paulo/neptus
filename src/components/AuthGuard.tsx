"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

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
  const {
    cachedUser,
    validateOfflineSession,
    setCachedUser,
    setOfflineStatus,
    isAuthRequired,
    hasEverLoggedIn,
    isDevMode,
  } = useOfflineAuthStore();
  const [canAccess, setCanAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    setOfflineStatus(!isOnline);
  }, [isOnline, setOfflineStatus]);

  useEffect(() => {
    const checkAccess = () => {
      console.log("🔍 AuthGuard verificando acesso:", {
        status,
        isOnline,
        hasSession: !!session,
        hasCachedUser: !!cachedUser,
        hasEverLoggedIn,
        isDevMode: isDevMode(),
      });

      // Se ainda está carregando sessão online, espera
      if (isOnline && status === "loading") {
        console.log("⏳ Aguardando verificação de sessão online...");
        return;
      }

      // Verifica se auth é necessária baseado na nova lógica
      const authRequired = isAuthRequired();

      if (!authRequired) {
        console.log("✅ Auth não necessária - permitindo acesso");
        setCanAccess(true);
        setIsChecking(false);
        return;
      }

      // Se está online e autenticado, permite e salva no cache
      if (isOnline && status === "authenticated" && session?.user) {
        console.log("✅ Online e autenticado - salvando no cache");
        setCachedUser(session.user);
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

        // Se está offline e não tem cache válido, mas já fez login antes
        if (hasEverLoggedIn) {
          console.log(
            "📱 Offline sem cache válido, mas já logou antes - permitindo acesso limitado"
          );
          setCanAccess(true);
          setIsChecking(false);
          return;
        }
      }

      // Se chegou até aqui, precisa fazer login
      console.log("🔒 Redirecionando para login");
      router.push("/login");
    };

    checkAccess();
  }, [
    status,
    session,
    isOnline,
    cachedUser,
    router,
    validateOfflineSession,
    setCachedUser,
    setOfflineStatus,
    isAuthRequired,
    hasEverLoggedIn,
    isDevMode,
  ]);

  if (isChecking) {
    return <LoadingFullScreen />;
  }

  if (!canAccess) {
    return <LoadingFullScreen />;
  }

  return <>{children}</>;
}
