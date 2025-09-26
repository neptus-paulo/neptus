import { useCallback, useEffect, useState } from "react";

import { useBluetoothSensorData } from "@/hooks/useBluetoothSensorData";
import {
  getLatestSensorData,
  subscribeToDataUpdates,
  useOnlineStatus,
} from "@/hooks/useOnlineStatus";
import { SensorData, turbidityService } from "@/services/esp32-service";
import { useConnectionStore } from "@/stores/connectionStore";

interface UseSensorDataReturn {
  sensorData: SensorData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  connectionType: "wifi" | "bluetooth";
  isConnected: boolean;
}

export const useSensorData = (): UseSensorDataReturn => {
  const { connectionType } = useConnectionStore();
  const [sensorData, setSensorData] = useState<SensorData | null>(() =>
    getLatestSensorData()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isOnline, needsConfiguration } = useOnlineStatus();

  // Hook do Bluetooth
  const {
    sensorData: bluetoothData,
    isConnecting,
    isConnected: bluetoothConnected,
    error: bluetoothError,
    connect: bluetoothConnect,
  } = useBluetoothSensorData();

  // Para Wi-Fi, usar o sistema atual de atualizações
  useEffect(() => {
    if (connectionType === "wifi") {
      const unsubscribe = subscribeToDataUpdates((data) => {
        setSensorData(data);
        if (data) {
          setError(null);
        }
      });

      return unsubscribe;
    }
  }, [connectionType]);

  // Para Bluetooth, usar os dados do hook específico
  useEffect(() => {
    if (connectionType === "bluetooth") {
      setSensorData(bluetoothData);
      setError(bluetoothError);
    }
  }, [connectionType, bluetoothData, bluetoothError]);

  const fetchData = useCallback(
    async (showLoading = true) => {
      if (connectionType === "bluetooth") {
        // Para Bluetooth, tentar conectar se não estiver conectado
        if (!bluetoothConnected) {
          await bluetoothConnect();
        }
        return;
      }

      // Para Wi-Fi, usar o método atual
      if (needsConfiguration || !isOnline) {
        return;
      }

      if (showLoading) setIsLoading(true);
      setError(null);

      try {
        const response = await turbidityService.getTurbidityData();
        setSensorData(response.data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao buscar dados";
        setError(errorMessage);
        console.error("Erro no useSensorData:", err);
      } finally {
        if (showLoading) setIsLoading(false);
      }
    },
    [connectionType, needsConfiguration, isOnline, bluetoothConnected, bluetoothConnect]
  );

  // Busca inicial quando conecta
  useEffect(() => {
    if (connectionType === "wifi") {
      if (isOnline && !needsConfiguration && !sensorData) {
        fetchData();
      }
    } else if (connectionType === "bluetooth") {
      // Para Bluetooth, a conexão é automática via hook
      if (!bluetoothConnected) {
        bluetoothConnect();
      }
    }
  }, [connectionType, isOnline, needsConfiguration, fetchData, sensorData, bluetoothConnected, bluetoothConnect]);

  const isConnected = connectionType === "wifi" ? isOnline && !needsConfiguration : bluetoothConnected;
  const loading = connectionType === "wifi" ? isLoading : isConnecting;

  return {
    sensorData,
    isLoading: loading,
    error,
    refetch: () => fetchData(true),
    connectionType,
    isConnected,
  };
};
