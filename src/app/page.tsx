import { Save } from "lucide-react";

import AppButton from "@/components/AppButton";
import DeviceStatus from "@/components/DeviceStatus";
import Header from "@/components/layout/Header";
import MultiMetricCard from "@/components/MultiMetricCard";
import SensorMetric from "@/components/SensorMetric";
import TurbidityDisplay from "@/components/TurbidityDisplay";

import { getSessionData } from "./api/auth/[...nextauth]/options";

const TURBIDITY_VALUE = 140;

const Home = async () => {
  const session = await getSessionData();
  console.log("Sessão:", session);

  // TODO: Utilizar dados da API invés de mock
  const sensorData = {
    dissolvedOxygen: { value: 8.2, unit: "MG/L" },
    temperature: { value: 24.5, unit: "ºC" },
    waterPH: { value: 7.2 },
    ammonia: { value: 9.2 },
    battery: 60,
    isConnected: true,
  };

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
          <p className="text-muted-foreground">Atualizado há 8s</p>
        </div>

        <div className="space-y-3">
          <TurbidityDisplay turbidityValue={TURBIDITY_VALUE} />

          <AppButton className="w-full" size="lg">
            <Save />
            Registrar e continuar
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
            isConnected={sensorData.isConnected}
            className="col-span-1"
          />
        </div>
      </main>
    </>
  );
};
export default Home;
