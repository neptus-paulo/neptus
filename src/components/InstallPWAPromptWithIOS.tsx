"use client";

import { Download, Share, Smartphone, X } from "lucide-react";
import { useEffect, useState } from "react";

import usePWAInstall from "@/hooks/usePWAInstall";

const InstallPWAPrompt = () => {
  const {
    isInstallable,
    isInstalled,
    isInstalling,
    isMobile,
    showManualPrompt,
    engagementScore,
    installApp,
    dismissInstallPrompt,
    showManualInstructions,
    forceEngagement,
    canInstall,
  } = usePWAInstall();

  const [isIOS, setIsIOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Detecta se é iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafariMobile =
      /Safari/.test(navigator.userAgent) &&
      !/(Chrome|CriOS|FxiOS|OPiOS|mercury)/.test(navigator.userAgent);

    setIsIOS(iOS);
    setIsSafari(isSafariMobile);

    // No iOS Safari, mostra as instruções se não estiver instalado
    if (iOS && isSafariMobile && !isInstalled) {
      // Verifica se já está em modo standalone (instalado)
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window.navigator as any).standalone;

      if (!isStandalone) {
        setShowIOSInstructions(true);
      }
    }
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (isIOS && isSafari) {
      // No iOS, apenas mostra as instruções
      setShowIOSInstructions(true);
    } else if (showManualPrompt) {
      // Android sem prompt automático
      if (engagementScore < 10) {
        // Tenta forçar engagement primeiro
        forceEngagement();
        setTimeout(() => {
          showManualInstructions();
        }, 2000);
      } else {
        showManualInstructions();
      }
    } else {
      // Android/Desktop - usa o método programático
      await installApp();
    }
  };

  const handleDismissIOS = () => {
    setShowIOSInstructions(false);
    dismissInstallPrompt();
  };

  // iOS Safari - Mostra instruções manuais
  if (isIOS && isSafari && showIOSInstructions && !isInstalled) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-[430px]">
        <div className="bg-background border border-border rounded-lg shadow-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Share className="w-5 h-5 text-primary" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground mb-2">
                Instalar Neptus no iPhone
              </h3>

              <ol className="text-xs text-muted-foreground space-y-1 mb-3">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center text-[10px] font-medium">
                    1
                  </span>
                  Toque no botão <Share className="w-3 h-3 inline mx-1" />{" "}
                  (Compartilhar)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center text-[10px] font-medium">
                    2
                  </span>
                  Selecione &ldquo;Adicionar à Tela de Início&rdquo;
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center text-[10px] font-medium">
                    3
                  </span>
                  Toque em &ldquo;Adicionar&rdquo;
                </li>
              </ol>

              <p className="text-xs text-muted-foreground">
                ⚠️ Funciona apenas no Safari, não no Chrome iOS
              </p>
            </div>

            <button
              onClick={handleDismissIOS}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Android/Desktop - Sempre mostra se for instalável (removendo verificação do isMobile)
  if (isInstalled || !isInstallable) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-[430px]">
      <div className="bg-background border border-border rounded-lg shadow-lg p-4 flex items-center gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Download className="w-5 h-5 text-primary" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground">
            {showManualPrompt
              ? "Instalar Neptus manualmente"
              : "Instalar Neptus"}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {showManualPrompt
              ? `Use o menu do Chrome (engagement: ${engagementScore})`
              : "Adicione o app à sua tela inicial para acesso rápido"}
          </p>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isInstalling
              ? "Instalando..."
              : isIOS
              ? "Como instalar"
              : showManualPrompt
              ? "Como instalar"
              : "Instalar"}
          </button>
          <button
            onClick={dismissInstallPrompt}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWAPrompt;
