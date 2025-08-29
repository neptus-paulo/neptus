import { AxiosResponse } from "axios";

import api from "@/lib/axios";
import { useESP32ConfigStore } from "@/stores/esp32ConfigStore";

export interface SensorData {
  turbidez: number;
}

interface TurbidityResponse {
  data: SensorData;
}

const buildDirectUrl = (): string => {
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

const buildProxyUrl = (): string => {
  const directUrl = buildDirectUrl();
  return `/api/esp32/proxy?url=${encodeURIComponent(directUrl)}`;
};

// Detecta se está rodando em produção (HTTPS)
const isProduction = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.location.protocol === 'https:';
};

export const turbidityService = {
  async getTurbidityData(): Promise<TurbidityResponse> {
    try {
      const useProxy = isProduction();
      const url = useProxy ? buildProxyUrl() : buildDirectUrl();
      
      console.log(`🌊 Buscando dados de turbidez via ${useProxy ? 'PROXY' : 'DIRETO'}: ${url}`);

      let response: AxiosResponse<SensorData>;

      if (useProxy) {
        // Em produção (HTTPS), usa o proxy
        response = await api.get(url, {
          timeout: 15000, // Mais tempo para o proxy
        });
      } else {
        // Em desenvolvimento (HTTP), faz chamada direta
        response = await api.get(url, {
          timeout: 8000,
        });
      }

      console.log("✅ Dados recebidos:", response.data);

      return { data: response.data };
    } catch (error: unknown) {
      console.error("❌ Erro na requisição de turbidez:", error);

      if (error instanceof Error && error.message === "ESP32_NOT_CONFIGURED") {
        throw new Error("Dispositivo não configurado");
      }

      if (error instanceof Error) {
        interface AxiosError extends Error {
          code?: string;
          name: string;
          response?: { 
            data?: { 
              message?: string;
              error?: string;
            };
            status?: number;
          };
        }

        const axiosError = error as AxiosError;

        // Tratamento de erros do proxy
        if (axiosError.response?.data?.error) {
          const proxyError = axiosError.response.data.error;
          
          if (proxyError.includes("timeout")) {
            throw new Error("Timeout - ESP32 não respondeu em 10 segundos");
          }
          
          if (proxyError.includes("Connection failed")) {
            throw new Error("Falha na conexão com ESP32");
          }
          
          throw new Error(proxyError);
        }

        // Tratamento de erros diretos
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
