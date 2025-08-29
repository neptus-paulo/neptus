"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthState } from "@/components/OfflineAuthManager";
import LoadingFullScreen from "@/components/LoadingFullScreen";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, isOffline } = useAuthState();
  const [isInitialized, setIsInitialized] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Delay para permitir que as stores sejam hidratadas
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isInitialized && !isLoading && !isAuthenticated && !redirecting) {
      console.log("🔒 Não autenticado, redirecionando para login");
      setRedirecting(true);
      router.push("/login");
    }
  }, [isInitialized, isLoading, isAuthenticated, router, redirecting]);

  // Ainda está inicializando ou carregando
  if (!isInitialized || isLoading) {
    return <LoadingFullScreen />;
  }

  // Está redirecionando
  if (redirecting) {
    return <LoadingFullScreen />;
  }

  // Se não está autenticado, mostra loading (vai redirecionar)
  if (!isAuthenticated) {
    return <LoadingFullScreen />;
  }

  // Se chegou aqui, está autenticado (online ou offline)
  console.log("✅ Usuário autenticado, permitindo acesso", { isOffline });
  return <>{children}</>;
}
