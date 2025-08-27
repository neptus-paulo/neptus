import { useCallback, useEffect, useState } from "react";

import {
  getLatestSensorData,
  subscribeToDataUpdates,
  useOnlineStatus,
} from "@/hooks/useOnlineStatus";
import { SensorData, turbidityService } from "@/services/turbidity-service";

interface UseSensorDataReturn {
  sensorData: SensorData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useSensorData = (): UseSensorDataReturn => {
  const [sensorData, setSensorData] = useState<SensorData | null>(() =>
    getLatestSensorData()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isOnline, needsConfiguration } = useOnlineStatus();

  useEffect(() => {
    const unsubscribe = subscribeToDataUpdates((data) => {
      setSensorData(data);
      if (data) {
        setError(null);
      }
    });

    return unsubscribe;
  }, []);

  const fetchData = useCallback(
    async (showLoading = true) => {
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
    [needsConfiguration, isOnline]
  );

  // Busca inicial quando conecta (apenas se não há dados automáticos)
  useEffect(() => {
    if (isOnline && !needsConfiguration && !sensorData) {
      fetchData();
    }
  }, [isOnline, needsConfiguration, fetchData, sensorData]);

  return {
    sensorData,
    isLoading,
    error,
    refetch: () => fetchData(true),
  };
};
