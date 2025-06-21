export const useSensorData = () => {
  // Dados simulados no novo formato do ESP32
  const sensorData = {
    voltagem: 3.7,
    turbidez: 42.5,
    nivel: "Médio",
  };

  return {
    sensorData,
  };
};
