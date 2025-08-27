import { AxiosResponse } from "axios";

import api from "@/lib/axios";
import { useESP32ConfigStore } from "@/stores/esp32ConfigStore";

export interface SensorData {
  turbidez: number;
}

interface TurbidityResponse {
  data: SensorData;
}

// Função para construir URL dinâmica baseada na configuração
const buildApiUrl = (): string => {
  const config = useESP32ConfigStore.getState().config;

  if (!config.isConfigured || !config.ip) {
    throw new Error("ESP32_NOT_CONFIGURED");
  }

  const baseUrl = config.ip;
  const port = config.port ? `:${config.port}` : "";
  const endpoint = config.endpoint
    ? `/${config.endpoint.replace(/^\/+/, "")}`
    : "/turbidez";

  return `http://${baseUrl}${port}${endpoint}`;
};

export const turbidityService = {
  async getTurbidityData(): Promise<TurbidityResponse> {
    try {
      const url = buildApiUrl();
      console.log(`🌊 Buscando dados de turbidez: ${url}`);

      // Timeout de 8 segundos para ESP32
      const response: AxiosResponse<SensorData> = await api.get(url, {
        timeout: 8000,
      });

      console.log("✅ Dados recebidos:", response.data);
      return { data: response.data };
    } catch (error: unknown) {
      console.error("❌ Erro na requisição de turbidez:", error);

      // Tratamento de erros específicos
      if (error instanceof Error && error.message === "ESP32_NOT_CONFIGURED") {
        throw new Error("Dispositivo não configurado");
      }

      if (error instanceof Error) {
        const axiosError = error as any;

        if (
          axiosError.code === "ECONNREFUSED" ||
          axiosError.code === "ERR_NETWORK"
        ) {
          throw new Error("Dispositivo não encontrado");
        }

        if (axiosError.code === "ENOTFOUND") {
          throw new Error("IP inválido ou inacessível");
        }

        if (axiosError.name === "AxiosError") {
          if (axiosError.code === "ECONNREFUSED") {
            throw new Error("Conexão rejeitada pelo dispositivo");
          } else if (axiosError.code === "ECONNABORTED") {
            throw new Error("Timeout - dispositivo não responde");
          } else {
            throw new Error("Falha na comunicação com dispositivo");
          }
        }

        // Erro genérico
        const errorMessage =
          axiosError.response?.data?.message ||
          error.message ||
          "Erro desconhecido";
        throw new Error(errorMessage);
      }

      throw new Error("Erro desconhecido");
    }
  },
};
