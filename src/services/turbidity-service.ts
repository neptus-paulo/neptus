import axios from "@/lib/axios";

export interface SensorData {
  voltagem: number;
  turbidez: number;
  nivel: string;
}

interface TurbidityResponse {
  success: boolean;
  data: SensorData;
  timestamp: string;
}

export const turbidityService = {
  // Buscar dados de turbidez
  async getTurbidityData(): Promise<TurbidityResponse> {
    try {
      const response = await axios.get("/api/turbidez");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados de turbidez:", error);
      throw error;
    }
  },

  // Enviar dados de turbidez (para futuras implementações)
  async sendTurbidityReading(
    data: Partial<SensorData>
  ): Promise<TurbidityResponse> {
    try {
      const response = await axios.post("/api/turbidez", data);
      return response.data;
    } catch (error) {
      console.error("Erro ao enviar dados de turbidez:", error);
      throw error;
    }
  },
};

export type { TurbidityResponse };
