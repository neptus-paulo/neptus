"use client";

import { RefreshCw, Save, Settings } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import AppButton from "@/components/AppButton";
import DeviceStatus from "@/components/DeviceStatus";
import ESP32Config from "@/components/ESP32Config";
import LoadingFullScreen from "@/components/LoadingFullScreen";
import MultiMetricCard from "@/components/MultiMetricCard";
import { useAuthState } from "@/components/OfflineAuthManager";
import PageHeader from "@/components/PageHeader";
import SensorMetric from "@/components/SensorMetric";
import TurbidityDisplay from "@/components/TurbidityDisplay";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useSensorData } from "@/hooks/useSensorData";
import { SensorData } from "@/services/turbidity-service";

import AdditionalParameters from "./_components/AdditionalParameters/page";

export default function Home() {
  const { isAuthenticated, isLoading: authLoading } = useAuthState();
  const { isOnline, needsConfiguration } = useOnlineStatus();
  const { sensorData, isLoading, error, refetch } = useSensorData();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Valor da turbidez para exibição
  const turbidityValue = sensorData?.turbidez || 0;

  // Status da última atualização
  const getLastUpdatedText = () => {
    if (needsConfiguration) return "ESP32 não configurado";
    if (isLoading) return "Carregando...";
    if (error) return "Erro na conexão";
    if (!isOnline) return "Dispositivo offline";
    if (sensorData) return "Atualizado agora mesmo";
    return "Nenhum dado disponível";
  };

  const handleSaveReading = () => {
    if (!sensorData) return;
    setIsOpenModal(true);
    // TODO: Implementar salvamento quando necessário
  };

  if (authLoading) {
    return <LoadingFullScreen />;
  }

  return (
    <>
      <main className="space-y-5">
        <PageHeader
          title="Turbidez em tempo real"
          description={getLastUpdatedText()}
        />

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
              onClick={refetch}
              disabled={isLoading || needsConfiguration}
            >
              <RefreshCw className={isLoading ? "animate-spin" : ""} />
            </AppButton>

            <AppButton
              variant="outline"
              size="lg"
              onClick={() => setIsConfigModalOpen(true)}
            >
              <Settings />
            </AppButton>
          </div>
        </div>

        <div className="grid grid-cols-2 grid-rows-2 gap-5">
          <SensorMetric
            title="Oxigênio Dissolvido"
            value={6.7}
            unit={"mg/L"}
            className="col-span-1"
          />

          <SensorMetric
            title="Temperatura"
            value={27}
            unit={"ºC"}
            className="col-span-1"
          />

          <MultiMetricCard
            metrics={[
              { title: "pH", value: 7.5 },
              { title: "Amônia", value: 0.03, unit: "mg/L" },
            ]}
            className="col-span-1"
          />

          <DeviceStatus
            batteryLevel={67}
            isConnected={isOnline}
            className="col-span-1"
          />
        </div>
      </main>

      <AdditionalParameters
        isOpen={isOpenModal}
        onOpenChange={setIsOpenModal}
      />

      <ESP32Config
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSuccess={() => setIsConfigModalOpen(false)}
      />
    </>
  );
}
