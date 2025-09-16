"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { SensorData, turbidityService } from "@/services/esp32-service";
import { useESP32ConfigStore } from "@/stores/esp32ConfigStore";

interface ESP32Config {
  ip: string;
  port: string;
  endpoint: string;
  isConfigured: boolean;
}

type ConnectionState =
  | "not-configured"
  | "testing"
  | "connected"
  | "failed"
  | "stopped";

let globalState: ConnectionState = "not-configured";
let globalInterval: NodeJS.Timeout | null = null;
let isChecking = false;
let lastToastTime = 0;
let latestSensorData: SensorData | null = null;
let hasShownInitialToast = false; // Controla se já mostrou toast inicial
let isFirstAppLoad = true; // Controla se é o primeiro carregamento do app
let allowToasts = false; // Controla se pode mostrar toasts
let consecutiveFailures = 0; // Contador de falhas consecutivas
const MAX_CONSECUTIVE_FAILURES = 3; // Máximo de falhas antes de parar
const dataUpdateCallbacks: Array<(data: SensorData | null) => void> = [];

const updateSensorData = (data: SensorData | null) => {
  latestSensorData = data;
  dataUpdateCallbacks.forEach((callback) => callback(data));
};

export const subscribeToDataUpdates = (
  callback: (data: SensorData | null) => void
) => {
  dataUpdateCallbacks.push(callback);
  if (latestSensorData) {
    callback(latestSensorData);
  }
  return () => {
    const index = dataUpdateCallbacks.indexOf(callback);
    if (index > -1) {
      dataUpdateCallbacks.splice(index, 1);
    }
  };
};

export const getLatestSensorData = () => latestSensorData;

const hasValidConfig = (config: ESP32Config): boolean => {
  return !!(config.isConfigured && config.ip && config.ip.trim());
};

const testConnection = async (config: ESP32Config): Promise<boolean> => {
  if (isChecking) return false;

  isChecking = true;
  try {
    console.log("🔍 Testando conexão com ESP32...");
    const response = await turbidityService.getTurbidityData();
    updateSensorData(response.data);
    consecutiveFailures = 0; // Reset contador de falhas em caso de sucesso
    console.log("✅ Conexão bem-sucedida, dados recebidos:", response.data);
    return true;
  } catch (error) {
    consecutiveFailures++;
    console.error(
      `❌ Teste de conexão falhou (${consecutiveFailures}/${MAX_CONSECUTIVE_FAILURES}):`,
      error
    );
    updateSensorData(null);
    return false;
  } finally {
    isChecking = false;
  }
};

const showConfigurationToast = () => {
  // Só mostra toast se permitido e ainda não mostrou o inicial
  if (!allowToasts || hasShownInitialToast) return;

  const now = Date.now();
  if (now - lastToastTime < 30000) return;

  lastToastTime = now;
  hasShownInitialToast = true;

  toast.error("Configure o ESP32", {
    description:
      "É necessário configurar o IP e porta do ESP32 para continuar.",
    duration: 5000,
  });
};

const stopAllChecks = () => {
  if (globalInterval) {
    clearInterval(globalInterval);
    globalInterval = null;
  }
  globalState = "stopped";
  console.log("🛑 Verificações interrompidas");
};

const startAutoChecks = () => {
  stopAllChecks();
  consecutiveFailures = 0; // Reset contador ao iniciar

  globalState = "connected";
  globalInterval = setInterval(async () => {
    const config = useESP32ConfigStore.getState().config;

    if (!hasValidConfig(config)) {
      stopAllChecks();
      return;
    }

    const isConnected = await testConnection(config);

    // Só para as verificações se tiver muitas falhas consecutivas
    if (!isConnected && consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
      console.error(
        `🚫 Muitas falhas consecutivas (${consecutiveFailures}), parando verificações`
      );
      stopAllChecks();
      globalState = "failed";

      // Só mostra toast de conexão perdida se permitido
      if (allowToasts) {
        toast.error("Conexão perdida", {
          description: `ESP32 não responde após ${MAX_CONSECUTIVE_FAILURES} tentativas. Verifique o dispositivo.`,
          duration: 4000,
        });
      }
    } else if (!isConnected) {
      console.warn(
        `⚠️ Falha temporária na conexão (${consecutiveFailures}/${MAX_CONSECUTIVE_FAILURES}), continuando...`
      );
    }
  }, 2000);

  console.log("🟢 Verificações automáticas iniciadas (2s)");
};

export const validateAndStartConnection = async (): Promise<boolean> => {
  const config = useESP32ConfigStore.getState().config;

  if (!hasValidConfig(config)) {
    globalState = "not-configured";
    stopAllChecks();
    return false;
  }

  globalState = "testing";
  const isConnected = await testConnection(config);

  if (isConnected) {
    startAutoChecks();

    // Sempre mostra toast de sucesso quando conecta
    toast.success("ESP32 conectado!", {
      description:
        "Conexão estabelecida com sucesso. Dados sendo atualizados automaticamente.",
      duration: 3000,
    });
    return true;
  } else {
    globalState = "failed";
    stopAllChecks();
    return false;
  }
};

export const restartConnectionChecks = async () => {
  console.log("🔄 Reiniciando verificações...");
  lastToastTime = 0;
  hasShownInitialToast = false; // Reset do controle de toast inicial
  consecutiveFailures = 0; // Reset contador de falhas
  await validateAndStartConnection();
};

// Função para permitir toasts (chamada apenas no dashboard principal)
export const enableToasts = () => {
  allowToasts = true;
};

// Função para resetar estado quando entra no app pela primeira vez
export const initializeAppState = () => {
  if (isFirstAppLoad) {
    isFirstAppLoad = false;
    allowToasts = true;
    hasShownInitialToast = false;
  }
};

// Função para resetar contador de falhas (útil para debug)
export const resetFailureCounter = () => {
  consecutiveFailures = 0;
  console.log("🔄 Contador de falhas resetado");
};

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [needsConfiguration, setNeedsConfiguration] = useState(false);
  const { config } = useESP32ConfigStore();

  useEffect(() => {
    // Verificar status de conectividade real da internet
    const checkNetworkStatus = () => {
      return navigator.onLine;
    };

    const checkInitialState = async () => {
      const hasInternetConnection = checkNetworkStatus();

      if (!hasInternetConnection) {
        // Se não tem internet, assume offline
        setIsOnline(false);
        setNeedsConfiguration(false);
        stopAllChecks();
        return;
      }

      if (!hasValidConfig(config)) {
        setNeedsConfiguration(true);
        setIsOnline(false);
        globalState = "not-configured";
        stopAllChecks();

        // Só mostra toast de configuração se permitido e é primeira vez
        if (allowToasts && !hasShownInitialToast) {
          setTimeout(showConfigurationToast, 1000);
        }
        return;
      }

      setNeedsConfiguration(false);
      const connected = await validateAndStartConnection();
      setIsOnline(connected);
    };

    // Listeners para mudanças de conectividade
    const handleOnline = () => {
      console.log("🌐 Voltou online");
      checkInitialState();
    };

    const handleOffline = () => {
      console.log("📵 Ficou offline");
      setIsOnline(false);
      stopAllChecks();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    checkInitialState();

    const stateMonitor = setInterval(() => {
      const hasInternet = checkNetworkStatus();

      if (!hasInternet) {
        setIsOnline(false);
        return;
      }

      const currentlyOnline = globalState === "connected";
      const currentlyNeedsConfig = !hasValidConfig(config);

      setIsOnline(currentlyOnline);
      setNeedsConfiguration(currentlyNeedsConfig);
    }, 1000);

    return () => {
      clearInterval(stateMonitor);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [config]);

  useEffect(() => {
    return () => {};
  }, []);

  return {
    isOnline,
    needsConfiguration,
    connectionState: globalState,
  };
};
