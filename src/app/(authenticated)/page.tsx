"use client";

import { BluetoothIcon, RefreshCw, Save, Settings } from "lucide-react";
import { Timestamp } from "next/dist/server/lib/cache-handlers/types";
import { useCallback, useEffect, useState } from "react";

import AppButton from "@/components/AppButton";
import BluetoothConfig from "@/components/BluetoothConfig";
import DeviceStatus from "@/components/DeviceStatus";
import LoadingFullScreen from "@/components/LoadingFullScreen";
import MultiMetricCard from "@/components/MultiMetricCard";
import { useAuthState } from "@/components/OfflineAuthManager";
import PageHeader from "@/components/PageHeader";
import SensorMetric from "@/components/SensorMetric";
import TurbidityDisplay from "@/components/TurbidityDisplay";
import { useInternetConnection } from "@/hooks/useInternetConnection";
import { useSensorData } from "@/hooks/useSensorData";

import AdditionalParameters from "./_components/AdditionalParameters/page";

// Tipo para o último registro de amostra
interface LastSampleData {
  id: string;
  turbidityData?: {
    value: number;
    quality: string;
    timestamp: {
      time: string;
      date: string;
    };
  };
  tank?: string;
  oxygen?: number;
  temperature?: number;
  ph?: number;
  ammonia?: number;
  waterColor?: number;
}

export default function Home() {
  const { isAuthenticated, isLoading: authLoading } = useAuthState();
  const { isOnline } = useInternetConnection();
  const { sensorData, isLoading, error, refetch, isConnected } =
    useSensorData();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isBluetoothConfigOpen, setIsBluetoothConfigOpen] = useState(false);
  const [lastSampleData, setLastSampleData] = useState<LastSampleData | null>(
    null
  );

  const [storedData, setStoredData] = useState<{
    turbidityValue: number;
    timestamp: string;
  } | null>(null);

  // Função para buscar o último registro de amostra
  const getLastSampleData = useCallback(() => {
    try {
      const data = localStorage.getItem("storagedTurbidityData");
      if (data) {
        const samples = JSON.parse(data);
        if (samples.length > 0) {
          // Pegar o último registro (mais recente por ordem de inserção)
          return samples[samples.length - 1];
        }
      }
    } catch (error) {
      console.error("Erro ao buscar último registro:", error);
    }
    return null;
  }, []);

  // Carregar último registro ao montar o componente e quando modal fechar
  useEffect(() => {
    setLastSampleData(getLastSampleData());
  }, [getLastSampleData, isOpenModal]);

  // Valor da turbidez para exibição
  const turbidityValue = sensorData?.turbidez || 0;

  // Status da última atualização
  const getLastUpdatedText = () => {
    // Mostra status da conexão com a INTERNET
    if (!isOnline) return "Você está offline";
    return "Conectado à internet";
  };

  const handleSaveReading = () => {
    if (!sensorData) return;
    setIsOpenModal(true);
    // TODO: Implementar salvamento quando necessário
    localStorage.setItem(
      "turbidityData",
      JSON.stringify({ turbidityValue, timestamp: new Date().toISOString() })
    );
    setStoredData({ turbidityValue, timestamp: new Date().toISOString() });
  };

  if (authLoading) {
    return <LoadingFullScreen />;
  }

  return (
    <>
      <main className="space-y-5">
        <PageHeader
          title="Leitura de turbidez"
          description={getLastUpdatedText()}
        />

        {isConnected ? (
          <div className="space-y-3">
            <TurbidityDisplay turbidityValue={turbidityValue} />

            <div className="flex gap-2">
              <AppButton
                className="flex-1"
                size="lg"
                onClick={handleSaveReading}
                disabled={isLoading || !sensorData}
              >
                <Save />
                Registrar e continuar
              </AppButton>

              <AppButton
                variant="outline"
                size="lg"
                onClick={() => setIsBluetoothConfigOpen(true)}
              >
                <Settings />
              </AppButton>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <AppButton
              variant="default"
              size="lg"
              onClick={refetch}
              disabled={isLoading}
            >
              <BluetoothIcon />
              Conectar ao dispositivo
            </AppButton>
          </div>
        )}

        <div className="grid grid-cols-2 grid-rows-2 gap-5">
          <SensorMetric
            title="Oxigênio Dissolvido"
            value={lastSampleData?.oxygen}
            unit={"mg/L"}
            className="col-span-1"
          />

          <SensorMetric
            title="Temperatura"
            value={lastSampleData?.temperature}
            unit={"ºC"}
            className="col-span-1"
          />

          <MultiMetricCard
            metrics={[
              { title: "pH", value: lastSampleData?.ph },
              { title: "Amônia", value: lastSampleData?.ammonia, unit: "mg/L" },
            ]}
            className="col-span-1"
          />

          <DeviceStatus
            batteryLevel={67}
            isConnected={isConnected}
            deviceName="ESP32-Turbidez"
            className="col-span-1"
          />
        </div>
      </main>

      <AdditionalParameters
        isOpen={isOpenModal}
        onOpenChange={setIsOpenModal}
        storedData={storedData}
      />

      <BluetoothConfig
        isOpen={isBluetoothConfigOpen}
        onClose={() => setIsBluetoothConfigOpen(false)}
        onSuccess={() => setIsBluetoothConfigOpen(false)}
      />
    </>
  );
}
