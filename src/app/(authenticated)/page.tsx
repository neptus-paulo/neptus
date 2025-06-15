"use client";

import { RefreshCw, Save, Settings } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import AppButton from "@/components/AppButton";
import DeviceStatus from "@/components/DeviceStatus";
import ESP32Config from "@/components/ESP32Config";
import MultiMetricCard from "@/components/MultiMetricCard";
import { useAuthState } from "@/components/OfflineAuthManager";
import SensorMetric from "@/components/SensorMetric";
import TurbidityDisplay from "@/components/TurbidityDisplay";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { esp32Service } from "@/services/esp32-service";
import { useESP32ConfigStore } from "@/stores/esp32ConfigStore";
import { useOfflineDataStore } from "@/stores/offlineDataStore";

interface SensorData {
  dissolvedOxygen: { value: number; unit: string };
  temperature: { value: number; unit: string };
  waterPH: { value: number };
  ammonia: { value: number };
  battery: number;
  isConnected: boolean;
}

export default function Home() {
  const { isAuthenticated, isLoading: authLoading } = useAuthState();
  const isOnline = useOnlineStatus();
  const { cachedSensorData, setCachedSensorData, saveReading } =
    useOfflineDataStore();
  const { config: esp32Config } = useESP32ConfigStore();

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
  const [isLoading, setIsLoading] = useState(false);
  const [showESP32Config, setShowESP32Config] = useState(false);

  // Função para buscar dados da API (ESP32)
  const fetchTurbidityData = useCallback(async () => {
    if (!isOnline) return;

    // Verifica se o ESP32 está configurado
    if (!esp32Config.isConfigured || !esp32Config.ip) {
      setShowESP32Config(true);
      return;
    }

    setIsLoading(true);
    try {
      // Primeiro tenta buscar do ESP32 (simulado)
      const response = await esp32Service.getTurbidityData(
        esp32Config.ip,
        esp32Config.port
      );

      if (response.success) {
        const apiData = response.data;

        setSensorData({
          dissolvedOxygen: apiData.dissolvedOxygen,
          temperature: apiData.temperature,
          waterPH: apiData.waterPH,
          ammonia: apiData.ammonia,
          battery: apiData.battery,
          isConnected: true,
        });

        setTurbidityValue(apiData.turbidity.value);
        setLastUpdated("agora");

        // Cache the new data
        const dataToCache = {
          dissolvedOxygen: apiData.dissolvedOxygen,
          temperature: apiData.temperature,
          waterPH: apiData.waterPH,
          ammonia: apiData.ammonia,
          battery: apiData.battery,
          isConnected: true,
          turbidity: apiData.turbidity.value,
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
    setCachedSensorData,
    esp32Config.isConfigured,
    esp32Config.ip,
    esp32Config.port,
  ]);

  // Carregar dados da API quando ficar online
  useEffect(() => {
    if (isOnline) {
      fetchTurbidityData();
    }
  }, [isOnline, fetchTurbidityData]);

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
        : "Leitura salva localmente. Será sincronizada quando voltar online."
    );
  };

  if (authLoading) {
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
      <main className="space-y-5">
        <div className="flex-col">
          <h1 className="text-xl font-semibold">Turbidez em tempo real</h1>
          <p className="text-muted-foreground">
            Atualizado há {lastUpdated}
            {!isOnline && " (dados em cache)"}
          </p>
        </div>

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

      {/* Modal de Configuração do ESP32 */}
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
