import axios from "@/lib/axios";

interface TurbidityData {
  turbidity: {
    value: number;
    unit: string;
    status: string;
  };
  dissolvedOxygen: {
    value: number;
    unit: string;
  };
  temperature: {
    value: number;
    unit: string;
  };
  waterPH: {
    value: number;
  };
  ammonia: {
    value: number;
  };
  battery: number;
  timestamp: string;
  message: string;
}

interface TurbidityResponse {
  success: boolean;
  data: TurbidityData;
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
  async sendTurbidityReading(data: Partial<TurbidityData>): Promise<any> {
    try {
      const response = await axios.post("/api/turbidez", data);
      return response.data;
    } catch (error) {
      console.error("Erro ao enviar dados de turbidez:", error);
      throw error;
    }
  },
};

export type { TurbidityData, TurbidityResponse };
