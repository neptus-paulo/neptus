"use client";

import { Download, X } from "lucide-react";

import usePWAInstall from "@/hooks/usePWAInstall";

const InstallPWAPrompt = () => {
  const {
    isInstallable,
    isInstalled,
    isInstalling,
    installApp,
    dismissInstallPrompt,
    canInstall,
  } = usePWAInstall();

  const handleInstallClick = async () => {
    await installApp();
  };

  // Não mostra se já estiver instalado ou não for instalável
  if (isInstalled || !isInstallable || !canInstall) {
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
            Instalar Neptus
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Adicione o app à sua tela inicial para acesso rápido
          </p>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isInstalling ? "Instalando..." : "Instalar"}
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
