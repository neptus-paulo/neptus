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
import {
  esp32Service,
  SensorData as ESP32SensorData,
} from "@/services/esp32-service";
import { useESP32ConfigStore } from "@/stores/esp32ConfigStore";
import { useOfflineDataStore } from "@/stores/offlineDataStore";

import AdditionalParameters from "./_components/AdditionalParameters/page";

interface SensorData {
  voltagem: number;
  turbidez: number;
  nivel: string;
}

export default function Home() {
  const { isAuthenticated, isLoading: authLoading } = useAuthState();
  const isOnline = useOnlineStatus();
  const { cachedSensorData, setCachedSensorData, saveReading } =
    useOfflineDataStore();
  const { config: esp32Config } = useESP32ConfigStore();

  const [sensorData, setSensorData] = useState<SensorData>({
    voltagem: 0,
    turbidez: 0,
    nivel: "",
    // oxigenio: { value: 0, unit: "mg/L" },
    // temperatura: { value: 0, unit: "°C" },
    // bateria: 0,
    // phAmmoniaMetrics: [
    //   { title: "pH", value: 0, unit: "pH" },
    //   { title: "Amônia", value: 0, unit: "mg/L" },
    // ],
  });

  const [turbidityValue, setTurbidityValue] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("8s");
  const [isLoading, setIsLoading] = useState(false);
  const [showESP32Config, setShowESP32Config] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const fetchTurbidityData = useCallback(async () => {
    console.log("isOnline", isOnline);
    if (!isOnline) return;

    if (!esp32Config.isConfigured || !esp32Config.ip) {
      setShowESP32Config(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await esp32Service.getTurbidityData(
        esp32Config.ip,
        esp32Config.endpoint,
        esp32Config.port
      );

      if (response.voltagem !== undefined) {
        const apiData = response;

        setSensorData({
          voltagem: apiData.voltagem,
          turbidez: apiData.turbidez,
          nivel: apiData.nivel,
        });

        setTurbidityValue(apiData.turbidez);
        setLastUpdated("agora");

        // Cache the new data
        const dataToCache = {
          voltagem: apiData.voltagem,
          turbidez: apiData.turbidez,
          nivel: apiData.nivel,
          timestamp: Date.now(),
        };
        setCachedSensorData(dataToCache);
      }
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
      setLastUpdated("erro na conexão");
    } finally {
      setIsLoading(false);
    }
  }, [
    isOnline,
    esp32Config.isConfigured,
    esp32Config.ip,
    esp32Config.port,
    esp32Config.endpoint,
    setCachedSensorData,
  ]);

  useEffect(() => {
    if (isOnline) {
      fetchTurbidityData();

      // const interval = setInterval(() => {
      //   fetchTurbidityData();
      // }, 3000);

      // return () => clearInterval(interval);
    }
  }, [isOnline, fetchTurbidityData]);

  useEffect(() => {
    if (!isOnline && cachedSensorData) {
      setSensorData({
        voltagem: cachedSensorData.voltagem,
        turbidez: cachedSensorData.turbidez,
        nivel: cachedSensorData.nivel,
      });
      setTurbidityValue(cachedSensorData.turbidez);
      setLastUpdated("offline");
    }
  }, [isOnline, cachedSensorData]);

  useEffect(() => {
    if (isOnline) {
      const dataToCache = {
        ...sensorData,
        timestamp: Date.now(),
      };
      setCachedSensorData(dataToCache);
    }
  }, [isOnline, sensorData, turbidityValue, setCachedSensorData]);

  const handleSaveReading = () => {
    setIsOpenModal(true);
    const reading = {
      ...sensorData,
      timestamp: Date.now(),
    };

    const readingId = saveReading(reading);
    console.log("Leitura salva com ID:", readingId);

    alert(
      isOnline
        ? "Leitura salva e enviada!"
        : "Leitura salva localmente. Será sincronizada quando voltar online."
    );
  };

  if (authLoading) {
    return <LoadingFullScreen />;
  }

  return (
    <>
      <main className="space-y-5">
        <PageHeader
          title="Turbidez em tempo real"
          description={`Atualizado há ${lastUpdated}`}
        />

        <div className="space-y-3">
          <TurbidityDisplay turbidityValue={turbidityValue} />

          <div className="flex gap-2">
            <AppButton
              className="flex-1"
              size="lg"
              onClick={handleSaveReading}
              disabled={isLoading}
            >
              <Save />
              Registrar e continuar
            </AppButton>

            {isOnline && (
              <>
                <AppButton
                  variant="outline"
                  size="lg"
                  onClick={fetchTurbidityData}
                  disabled={isLoading}
                >
                  <RefreshCw className={isLoading ? "animate-spin" : ""} />
                </AppButton>

                <AppButton
                  variant="outline"
                  size="lg"
                  onClick={() => setShowESP32Config(true)}
                >
                  <Settings />
                </AppButton>
              </>
            )}
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
            isConnected={isOnline ?? false}
            className="col-span-1"
          />
        </div>
      </main>

      <AdditionalParameters
        isOpen={isOpenModal}
        onOpenChange={setIsOpenModal}
      />

      {showESP32Config && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md">
            <ESP32Config
              onConfigSaved={() => {
                setShowESP32Config(false);
                fetchTurbidityData();
              }}
            />
            <div className="mt-4 flex justify-end">
              <AppButton
                variant="outline"
                className="w-full"
                onClick={() => setShowESP32Config(false)}
              >
                Fechar
              </AppButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
