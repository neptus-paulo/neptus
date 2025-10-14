"use client";

import { useEffect, useState } from "react";

export const useInternetStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Função para verificar conectividade real
    const checkInternetConnection = async () => {
      if (!navigator.onLine) {
        return false;
      }

      try {
        // Tenta fazer uma requisição simples para um endpoint que sempre funciona
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch('https://www.google.com/favicon.ico', { 
          method: 'HEAD',
          cache: 'no-cache',
          mode: 'no-cors',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return true;
      } catch {
        // Se falhar, tenta uma requisição local
        try {
          const response = await fetch(window.location.origin + '/favicon.ico', { 
            method: 'HEAD',
            cache: 'no-cache'
          });
          return response.ok;
        } catch {
          return false;
        }
      }
    };

    // Verifica status inicial
    const updateOnlineStatus = async () => {
      const online = await checkInternetConnection();
      console.log("🌐 Status internet:", online);
      setIsOnline(online);
    };

    // Handlers para eventos de conectividade
    const handleOnline = () => {
      console.log("🌐 Evento: Conectou à internet");
      setIsOnline(true);
      updateOnlineStatus();
    };

    const handleOffline = () => {
      console.log("📵 Evento: Desconectou da internet");
      setIsOnline(false);
    };

    // Adiciona listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verifica status inicial
    updateOnlineStatus();

    // Verifica periodicamente (a cada 30 segundos)
    const interval = setInterval(updateOnlineStatus, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return { isOnline };
};
