"use client";

import { useEffect } from "react";

export default function BasicServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const registerSW = async () => {
        try {
          // Primeiro, desregistra qualquer SW existente
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(
            registrations.map(registration => registration.unregister())
          );
          console.log("🗑️ SWs antigos desregistrados");

          // Registra o novo SW básico
          const registration = await navigator.serviceWorker.register("/sw-basic.js", {
            scope: "/",
          });

          console.log("✅ SW Básico registrado:", registration.scope);

          // Força ativação
          if (registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }

        } catch (error) {
          console.error("❌ Erro ao registrar SW básico:", error);
        }
      };

      // Registra após um delay para não interferir na carga inicial
      setTimeout(registerSW, 1000);
    }
  }, []);

  return null;
}