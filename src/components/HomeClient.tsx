"use client";

import { Save } from "lucide-react";
import { useEffect, useState } from "react";

import AppButton from "@/components/AppButton";
import DeviceStatus from "@/components/DeviceStatus";
import Header from "@/components/layout/Header";
import MultiMetricCard from "@/components/MultiMetricCard";
import { useAuthState } from "@/components/OfflineAuthManager";
import SensorMetric from "@/components/SensorMetric";
import TurbidityDisplay from "@/components/TurbidityDisplay";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useOfflineDataStore } from "@/stores/offlineDataStore";

interface SensorData {
  dissolvedOxygen: { value: number; unit: string };
  temperature: { value: number; unit: string };
  waterPH: { value: number };
  ammonia: { value: number };
  battery: number;
  isConnected: boolean;
}

export default function HomeClient() {
  const { isAuthenticated, isLoading } = useAuthState();
  const isOnline = useOnlineStatus();
  const { cachedSensorData, setCachedSensorData, saveReading } =
    useOfflineDataStore();

  const [sensorData, setSensorData] = useState<SensorData>({
    dissolvedOxygen: { value: 8.2, unit: "MG/L" },
    temperature: { value: 24.5, unit: "ºC" },
    waterPH: { value: 7.2 },
    ammonia: { value: 9.2 },
    battery: 60,
    isConnected: true,
  });

  const [turbidityValue, setTurbidityValue] = useState(140);
  const [lastUpdated, setLastUpdated] = useState("8s");

  // Load cached data when offline
  useEffect(() => {
    if (!isOnline && cachedSensorData) {
      setSensorData({
        dissolvedOxygen: cachedSensorData.dissolvedOxygen,
        temperature: cachedSensorData.temperature,
        waterPH: cachedSensorData.waterPH,
        ammonia: cachedSensorData.ammonia,
        battery: cachedSensorData.battery,
        isConnected: false, // Show as disconnected when offline
      });
      setTurbidityValue(cachedSensorData.turbidity);
      setLastUpdated("offline");
    }
  }, [isOnline, cachedSensorData]);

  // Cache data when online
  useEffect(() => {
    if (isOnline) {
      const dataToCache = {
        ...sensorData,
        turbidity: turbidityValue,
        timestamp: Date.now(),
      };
      setCachedSensorData(dataToCache);
    }
  }, [isOnline, sensorData, turbidityValue, setCachedSensorData]);

  const handleSaveReading = () => {
    const reading = {
      ...sensorData,
      turbidity: turbidityValue,
      timestamp: Date.now(),
    };

    const readingId = saveReading(reading);

    // Show confirmation
    alert(
      isOnline
        ? "Leitura salva e enviada!"
        : "Leitura salva localmente. Será sincronizada quando voltar online.",
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-xl font-semibold mb-4">Acesso Negado</h1>
        <p className="text-center text-muted-foreground">
          {isOnline
            ? "Você precisa fazer login para acessar esta página."
            : "Sessão offline expirada. Conecte-se à internet e faça login novamente."}
        </p>
      </div>
    );
  }

  const phAmmoniaMetrics = [
    { title: "PH da água", value: sensorData.waterPH.value },
    { title: "Amônia", value: sensorData.ammonia.value },
  ];

  return (
    <>
      <Header />

      <main className="p-5 space-y-5">
        <div className="flex-col">
          <h1 className="text-xl font-semibold">Turbidez em tempo real</h1>
          <p className="text-muted-foreground">
            Atualizado há {lastUpdated}
            {!isOnline && " (dados em cache)"}
          </p>
        </div>

        <div className="space-y-3">
          <TurbidityDisplay turbidityValue={turbidityValue} />

          <AppButton className="w-full" size="lg" onClick={handleSaveReading}>
            <Save />
            {isOnline ? "Registrar e continuar" : "Salvar offline"}
          </AppButton>
        </div>

        <div className="grid grid-cols-2 grid-rows-2 gap-5">
          <SensorMetric
            title="Oxigênio Dissolvido"
            value={sensorData.dissolvedOxygen.value}
            unit={sensorData.dissolvedOxygen.unit}
            className="col-span-1"
          />

          <SensorMetric
            title="Temperatura"
            value={sensorData.temperature.value}
            unit={sensorData.temperature.unit}
            className="col-span-1"
          />

          <MultiMetricCard metrics={phAmmoniaMetrics} className="col-span-1" />

          <DeviceStatus
            batteryLevel={sensorData.battery}
            isConnected={isOnline ? sensorData.isConnected : false}
            className="col-span-1"
          />
        </div>
      </main>
    </>
  );
}
