import axios from "axios";

// Configuração dinâmica para ESP32

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

export const esp32Service = {
  // Buscar dados de turbidez diretamente do ESP32
  async getTurbidityData(esp32Ip: string, port: string = "3000"): Promise<TurbidityResponse> {
    try {
      const baseUrl = `http://${esp32Ip}:${port}`;
      const response = await axios.get(`${baseUrl}/api/turbidez`, {
        timeout: 5000, // 5 segundos de timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados do ESP32:", error);
      throw error;
    }
  },

  // Testar conectividade com ESP32
  async testConnection(esp32Ip: string, port: string = "3000"): Promise<boolean> {
    try {
      const baseUrl = `http://${esp32Ip}:${port}`;
      const response = await axios.get(`${baseUrl}/api/turbidez`, {
        timeout: 3000
      });
      return response.status === 200;
    } catch (error) {
      console.error("ESP32 não está acessível:", error);
      return false;
    }
  }
};

export type { TurbidityData, TurbidityResponse };
