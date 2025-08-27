import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Sistema de engagement para mobile
let engagementScore = 0;
let interactionCount = 0;
let lastInteractionTime = 0;

const trackEngagement = () => {
  const now = Date.now();
  interactionCount++;

  if (now - lastInteractionTime > 1000) {
    // Apenas se passou 1s desde última interação
    engagementScore += 1;
    lastInteractionTime = now;
    console.log("📊 Engagement:", {
      score: engagementScore,
      interactions: interactionCount,
    });
  }
};

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showManualPrompt, setShowManualPrompt] = useState(false);

  useEffect(() => {
    const checkIfInstalled = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window.navigator as any).standalone ||
        document.referrer.includes("android-app://");

      console.log("📱 Installation check:", {
        isStandalone,
        displayMode: window.matchMedia("(display-mode: standalone)").matches,
        navigatorStandalone: (window.navigator as { standalone?: boolean })
          .standalone,
        referrer: document.referrer,
      });

      setIsInstalled(isStandalone);

      // Se já estiver instalado, não é instalável
      if (isStandalone) {
        setIsInstallable(false);
      }
    };

    const checkIfIOS = () => {
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const mobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      setIsIOS(iOS);
      setIsMobile(mobile);

      console.log("🔍 Device detection:", {
        iOS,
        mobile,
        userAgent: navigator.userAgent,
      });

      // No iOS, sempre consideramos "instalável" mesmo sem o evento beforeinstallprompt
      if (iOS && !isInstalled) {
        setIsInstallable(true);
      }
    };

    checkIfInstalled();
    checkIfIOS();

    // Sistema de engagement para forçar beforeinstallprompt no mobile
    if (isMobile && !isIOS && !isInstalled) {
      // Adiciona listeners para trackear engagement
      const events = ["click", "scroll", "keydown", "touchstart", "touchend"];
      events.forEach((event) => {
        document.addEventListener(event, trackEngagement, { passive: true });
      });

      // Cleanup dos listeners
      return () => {
        events.forEach((event) => {
          document.removeEventListener(event, trackEngagement);
        });
      };
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("🎉 beforeinstallprompt event captured on mobile:", isMobile);
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Só marca como instalável se não estiver instalado
      if (!isInstalled) {
        setIsInstallable(true);
        setShowManualPrompt(false); // Remove prompt manual se o automático funcionar
      }
    };

    const handleAppInstalled = () => {
      console.log("App installed successfully");
      setIsInstallable(false);
      setDeferredPrompt(null);
      setIsInstalled(true);
      setIsInstalling(false);
    };

    // Verifica se o prompt foi rejeitado anteriormente
    const wasRejected = localStorage.getItem("pwa-install-dismissed");
    const rejectedTime = wasRejected ? parseInt(wasRejected) : 0;
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000; // 24 horas

    // Reset após 24 horas
    if (rejectedTime && rejectedTime < oneDayAgo) {
      localStorage.removeItem("pwa-install-dismissed");
    }

    // Timeout para mostrar prompt manual no mobile Android se o automático não funcionar
    if (isMobile && !isIOS && !isInstalled && !deferredPrompt) {
      const timeout = setTimeout(() => {
        console.log("⏰ Timeout: Engagement score:", engagementScore);

        if (engagementScore < 10) {
          console.log("💡 Baixo engagement - mostrando prompt manual");
          setShowManualPrompt(true);
        } else {
          console.log("🎯 Alto engagement - aguardando beforeinstallprompt");
          // Se tem alto engagement, aguarda mais tempo para o prompt automático
          setTimeout(() => {
            if (!deferredPrompt) {
              console.log(
                "⏰ Prompt automático não apareceu - mostrando manual"
              );
              setShowManualPrompt(true);
            }
          }, 60000); // Mais 60 segundos
        }
      }, 15000); // Reduzido para 15 segundos

      return () => clearTimeout(timeout);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isInstalled, isMobile, isIOS, deferredPrompt]);

  const installApp = async (): Promise<boolean> => {
    if (!deferredPrompt || isInstalling) return false;

    try {
      setIsInstalling(true);

      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      console.log("User choice:", choiceResult.outcome);

      if (choiceResult.outcome === "accepted") {
        // O evento 'appinstalled' será disparado automaticamente
        return true;
      } else {
        // Usuário rejeitou
        localStorage.setItem("pwa-install-dismissed", Date.now().toString());
        setDeferredPrompt(null);
        setIsInstallable(false);
        return false;
      }
    } catch (error) {
      console.error("Error installing PWA:", error);
      return false;
    } finally {
      setIsInstalling(false);
    }
  };

  const dismissInstallPrompt = () => {
    setIsInstallable(false);
    setShowManualPrompt(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  const showManualInstructions = () => {
    // Para Android Chrome
    alert(
      "Para instalar o app:\n\n" +
        "1. Toque no menu (⋮) do Chrome\n" +
        "2. Procure por 'Instalar app' ou 'Adicionar à tela inicial'\n" +
        "3. Confirme a instalação\n\n" +
        "💡 Dica: Use a opção 'Instalar app' se disponível para experiência nativa!\n\n" +
        "Ou acesse as configurações do Chrome > Site e limpe os dados para resetar o prompt."
    );
  };

  const forceEngagement = () => {
    // Força pontuação alta de engagement
    engagementScore = 20;
    interactionCount = 50;
    console.log("🚀 Engagement forçado:", {
      score: engagementScore,
      interactions: interactionCount,
    });

    // Tenta disparar eventos que o Chrome monitora
    setTimeout(() => {
      // Simula navegação
      window.history.pushState({}, "", window.location.pathname);
      window.history.pushState({}, "", window.location.pathname);
    }, 100);
  };

  return {
    isInstallable: isInstallable || showManualPrompt,
    isInstalled,
    isInstalling,
    isIOS,
    isMobile,
    showManualPrompt,
    engagementScore,
    installApp,
    dismissInstallPrompt,
    showManualInstructions,
    forceEngagement,
    canInstall:
      (isInstallable && (!!deferredPrompt || isIOS)) || showManualPrompt,
  };
};

export default usePWAInstall;
