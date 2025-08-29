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

  useEffect(() => {
    // Pequeno delay para permitir que a store seja hidratada
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isInitialized && !isLoading && !isAuthenticated) {
      // Se não está autenticado nem online nem offline, redireciona para login
      router.push("/login");
    }
  }, [isInitialized, isLoading, isAuthenticated, router]);

  // Mostra loading enquanto verifica autenticação
  if (!isInitialized || isLoading) {
    return <LoadingFullScreen />;
  }

  // Se não está autenticado, mostra loading (vai redirecionar)
  if (!isAuthenticated) {
    return <LoadingFullScreen />;
  }

  // Se chegou aqui, está autenticado (online ou offline)
  return <>{children}</>;
}
