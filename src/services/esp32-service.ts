import axios from "axios";

// Interface para dados do ESP32 no novo formato
export interface SensorData {
  voltagem: number;
  turbidez: number;
  nivel: string;
}

export const esp32Service = {
  async getTurbidityData(
    esp32Ip: string,
    endpoint: string,
    port?: string
  ): Promise<SensorData> {
    try {
      // Se for localhost, usar a API do Next.js diretamente
      if (esp32Ip === "localhost" || esp32Ip === "127.0.0.1") {
        const response = await axios.get("/api/turbidez", {
          timeout: 5000,
        });
        if (response.data.success) {
          return response.data.data;
        }
        throw new Error("API retornou erro");
      }

      // Para ESP32 real, construir URL completa
      const baseUrl = `http://${esp32Ip}${port ? `:${port}` : ""}`;
      const fullUrl = endpoint.startsWith("/")
        ? `${baseUrl}${endpoint}`
        : `${baseUrl}/${endpoint}`;

      console.log("Buscando dados em:", fullUrl);

      const response = await axios.get(fullUrl, {
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados do ESP32:", error);
      throw error;
    }
  },

  // Testar conectividade com ESP32
  async testConnection(
    esp32Ip: string,
    endpoint: string,
    port?: string
  ): Promise<boolean> {
    try {
      // Se for localhost, usar a API do Next.js diretamente
      if (esp32Ip === "localhost" || esp32Ip === "127.0.0.1") {
        const response = await axios.get("/api/turbidez", {
          timeout: 5000,
        });
        return response.status === 200 && response.data.success;
      }

      // Para ESP32 real, construir URL completa
      const baseUrl = `http://${esp32Ip}${port ? `:${port}` : ""}`;
      const fullUrl = endpoint.startsWith("/")
        ? `${baseUrl}${endpoint}`
        : `${baseUrl}/${endpoint}`;

      console.log("Testando conexão com:", fullUrl);

      const response = await axios.get(fullUrl, {
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Resposta do teste:", response.status, response.data);
      return response.status === 200;
    } catch (error) {
      console.error("ESP32 não está acessível:", error);
      if (axios.isAxiosError(error)) {
        console.error("Detalhes do erro:", {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });

        // Se for erro de CORS ou rede, tentar usar a API local como fallback
        if (
          error.code === "ERR_NETWORK" ||
          error.code === "ERR_BLOCKED_BY_CLIENT"
        ) {
          console.log("Tentando usar API local como fallback...");
          try {
            const response = await axios.get("/api/turbidez", {
              timeout: 5000,
            });
            return response.status === 200 && response.data.success;
          } catch (fallbackError) {
            console.error("Fallback também falhou:", fallbackError);
          }
        }
      }
      return false;
    }
  },
};
