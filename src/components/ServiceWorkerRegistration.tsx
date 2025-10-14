"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        })
        .then((registration) => {
          console.log("✅ SW: Service Worker registrado:", registration.scope);

          // Listen para atualizações
          registration.addEventListener("updatefound", () => {
            console.log("🔄 SW: Nova versão disponível");
          });
        })
        .catch((error) => {
          console.error("❌ SW: Falha ao registrar:", error);
        });

      // Listen para mensagens do Service Worker
      navigator.serviceWorker.addEventListener("message", (event) => {
        console.log("📨 SW: Mensagem recebida:", event.data);
      });

      // Listen para mudanças no estado do Service Worker
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("🔄 SW: Controller mudou - nova versão ativa");
      });
    } else {
      console.warn("⚠️ SW: Service Worker não suportado neste navegador");
    }
  }, []);

  return null;
}
