export const useSensorData = () => {
  // TODO: Trocar os dados simulados por dados reais de uma API
  const sensorData = {
    dissolvedOxygen: { value: 8.2, unit: "MG/L" },
    temperature: { value: 24.5, unit: "ºC" },
    waterPH: { value: 7.2 },
    ammonia: { value: 9.2 },
    battery: 60,
    isConnected: false,
  };

  const phAmmoniaMetrics = [
    { title: "PH da água", value: sensorData.waterPH.value },
    { title: "Amônia", value: sensorData.ammonia.value },
  ];

  return {
    sensorData,
    phAmmoniaMetrics,
  };
};
