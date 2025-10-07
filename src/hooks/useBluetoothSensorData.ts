import { useCallback, useEffect, useState } from "react";

import {
  bluetoothService,
  SensorData,
} from "@/services/bluetooth-service";
import { useBluetoothConfigStore } from "@/stores/bluetoothConfigStore";

interface UseBluetoothSensorDataReturn {
  sensorData: SensorData | null;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isSupported: boolean;
}

export const useBluetoothSensorData = (): UseBluetoothSensorDataReturn => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { config, setConnectionStatus } = useBluetoothConfigStore();

  const isSupported = bluetoothService.isBluetoothSupported();

  // Monitora dados recebidos via Bluetooth
  useEffect(() => {
    const unsubscribeData = bluetoothService.onDataReceived((data) => {
      setSensorData(data);
      setError(null);
    });

    return unsubscribeData;
  }, []);

  // Monitora status de conexão
  useEffect(() => {
    const unsubscribeStatus = bluetoothService.onStatusChange((status) => {
      setIsConnected(status.isConnected);
      
      // Atualiza o store
      setConnectionStatus({
        isConnected: status.isConnected,
        deviceName: status.device?.name,
        lastConnection: status.isConnected ? new Date() : undefined,
      });

      if (!status.isConnected) {
        setError("Dispositivo desconectado");
      }
    });

    return unsubscribeStatus;
  }, [setConnectionStatus]);

  const connect = useCallback(async () => {
    if (!isSupported) {
      setError("Web Bluetooth não é suportado neste navegador");
      return;
    }

    if (!config.isConfigured) {
      setError("Bluetooth não está configurado");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Configura o serviço com os dados salvos
      bluetoothService.setConfig(
        config.serviceUUID,
        config.characteristicUUID,
        config.deviceName
      );

      const success = await bluetoothService.connect();
      
      if (success) {
        console.log("✅ Conectado via Bluetooth");
      } else {
        setError("Falha ao conectar com o dispositivo");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      console.error("❌ Erro ao conectar Bluetooth:", err);
    } finally {
      setIsConnecting(false);
    }
  }, [config, isSupported]);

  const disconnect = useCallback(async () => {
    try {
      await bluetoothService.disconnect();
      setSensorData(null);
      setError(null);
      console.log("🔌 Desconectado do Bluetooth");
    } catch (err) {
      console.error("❌ Erro ao desconectar:", err);
    }
  }, []);

  // Auto-conecta se estiver configurado e não conectado
  // REMOVIDO: não conecta automaticamente, apenas quando o usuário clicar
  // useEffect(() => {
  //   if (config.isConfigured && !isConnected && !isConnecting && isSupported) {
  //     const timer = setTimeout(() => {
  //       connect();
  //     }, 1000);

  //     return () => clearTimeout(timer);
  //   }
  // }, [config.isConfigured, isConnected, isConnecting, isSupported, connect]);

  return {
    sensorData,
    isConnecting,
    isConnected,
    error,
    connect,
    disconnect,
    isSupported,
  };
};