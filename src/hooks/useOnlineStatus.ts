"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { SensorData, turbidityService } from "@/services/turbidity-service";
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
    console.log(
      `🔍 Testando conexão: ${config.ip}:${config.port}/${config.endpoint}`
    );
    const response = await turbidityService.getTurbidityData();
    updateSensorData(response.data);
    console.log("📊 Dados atualizados:", response.data);
    return true;
  } catch (error) {
    console.error("❌ Teste de conexão falhou:", error);
    updateSensorData(null);
    return false;
  } finally {
    isChecking = false;
  }
};

const showConfigurationToast = () => {
  const now = Date.now();
  if (now - lastToastTime < 30000) return;

  lastToastTime = now;
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

  globalState = "connected";
  globalInterval = setInterval(async () => {
    const config = useESP32ConfigStore.getState().config;

    if (!hasValidConfig(config)) {
      stopAllChecks();
      return;
    }

    const isConnected = await testConnection(config);
    if (!isConnected) {
      stopAllChecks();
      globalState = "failed";
      toast.error("Conexão perdida", {
        description:
          "A conexão com o ESP32 foi perdida. Verifique o dispositivo.",
        duration: 4000,
      });
    }
  }, 2000);

  console.log("🟢 Verificações automáticas iniciadas (4s)");
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
  await validateAndStartConnection();
};

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [needsConfiguration, setNeedsConfiguration] = useState(false);
  const { config } = useESP32ConfigStore();

  useEffect(() => {
    const checkInitialState = async () => {
      if (!hasValidConfig(config)) {
        setNeedsConfiguration(true);
        setIsOnline(false);
        globalState = "not-configured";
        stopAllChecks();

        setTimeout(showConfigurationToast, 1000);
        return;
      }

      setNeedsConfiguration(false);
      const connected = await validateAndStartConnection();
      setIsOnline(connected);
    };

    checkInitialState();

    const stateMonitor = setInterval(() => {
      const currentlyOnline = globalState === "connected";
      const currentlyNeedsConfig = !hasValidConfig(config);

      setIsOnline(currentlyOnline);
      setNeedsConfiguration(currentlyNeedsConfig);
    }, 1000);

    return () => {
      clearInterval(stateMonitor);
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
