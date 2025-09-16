import axios from "axios";

import api from "@/lib/axios";
import { useESP32ConfigStore } from "@/stores/esp32ConfigStore";

export interface SensorData {
  turbidez: number;
  temperatura?: number;
  ph?: number;
}

export interface ESP32Data extends SensorData {
  timestamp: string;
}

interface TurbidityResponse {
  data: SensorData;
}

class ESP32Service {
  private buildDirectUrl(): string {
    const config = useESP32ConfigStore.getState().config;

    if (!config.isConfigured || !config.ip) {
      throw new Error("ESP32_NOT_CONFIGURED");
    }

    const baseUrl = config.ip;
    const port = config.port ? `:${config.port}` : "";
    const endpoint = config.endpoint
      ? `/${config.endpoint.replace(/^\/+/, "")}`
      : "/turbidez";

    return `https://${baseUrl}${port}${endpoint}`;
  }

  private buildProxyUrl(): string {
    const directUrl = this.buildDirectUrl();
    return `/api/esp32/proxy?url=${encodeURIComponent(directUrl)}`;
  }

  private isProduction(): boolean {
    if (typeof window === "undefined") return false;
    return window.location.protocol === "https:";
  }

  async testConnection(
    ip: string,
    endpoint: string = "turbidez",
    port: string = ""
  ): Promise<boolean> {
    try {
      const portSuffix = port ? `:${port}` : "";
      const cleanEndpoint = endpoint.replace(/^\/+/, "");
      const url = `https://${ip}${portSuffix}/${cleanEndpoint}`;

      console.log("🔍 Testando conexão com:", url);

      const response = await axios.get(url, {
        timeout: 8000,
        headers: {
          "Content-Type": "application/json",
        },
        validateStatus: function (status) {
          return status >= 200 && status < 300;
        },
      });

      console.log("📡 Resposta recebida:", response.data);

      const isValid =
        response.status === 200 &&
        response.data &&
        typeof response.data.turbidez === "number";

      console.log(
        "✅ Conexão válida:",
        isValid,
        "- Valor turbidez:",
        response.data.turbidez
      );

      return isValid;
    } catch (error) {
      console.error("❌ Erro no teste de conexão:", error);
      return false;
    }
  }

  async getTurbidityData(): Promise<TurbidityResponse> {
    try {
      const useProxy = this.isProduction();
      const url = useProxy ? this.buildProxyUrl() : this.buildDirectUrl();

      console.log(`📡 Fazendo requisição para: ${url}`);

      let response;

      if (useProxy) {
        // Em produção (HTTPS), usa o proxy
        response = await api.get(url, {
          timeout: 15000,
        });
      } else {
        // Em desenvolvimento (HTTP), faz chamada direta
        response = await api.get(url, {
          timeout: 10000,
          validateStatus: function (status) {
            return status >= 200 && status < 300;
          },
        });
      }

      console.log("✅ Resposta recebida:", response.data);
      return { data: response.data };
    } catch (error: unknown) {
      console.error("❌ Erro detalhado na requisição:", {
        error,
        message: error instanceof Error ? error.message : "Erro desconhecido",
      });

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
            throw new Error("Timeout - ESP32 não respondeu");
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
  }

  async getData(
    ip: string,
    endpoint: string = "turbidez",
    port: string = ""
  ): Promise<ESP32Data> {
    try {
      const portSuffix = port ? `:${port}` : "";
      const cleanEndpoint = endpoint.replace(/^\/+/, "");
      const url = `https://${ip}${portSuffix}/${cleanEndpoint}`;

      const response = await axios.get(url, {
        timeout: 8000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return {
        turbidez: response.data.turbidez || 0,
        temperatura: response.data.temperatura,
        ph: response.data.ph,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("❌ Erro ao buscar dados do ESP32:", error);
      throw new Error("Falha na comunicação com ESP32");
    }
  }

  async getTurbidityDataFromConfig(): Promise<ESP32Data> {
    const config = useESP32ConfigStore.getState().config;

    if (!config.isConfigured || !config.ip) {
      throw new Error("ESP32 não configurado");
    }

    return this.getData(config.ip, config.endpoint || "turbidez", config.port);
  }

  getTurbidityLevel(turbidity: number): "low" | "medium" | "high" {
    if (turbidity <= 5) return "low";
    if (turbidity <= 25) return "medium";
    return "high";
  }

  getTurbidityStatus(turbidity: number): string {
    const level = this.getTurbidityLevel(turbidity);
    switch (level) {
      case "low":
        return "Ótima";
      case "medium":
        return "Boa";
      case "high":
        return "Ruim";
      default:
        return "Desconhecida";
    }
  }

  getTurbidityColor(turbidity: number): string {
    const level = this.getTurbidityLevel(turbidity);
    switch (level) {
      case "low":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "high":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  }
}

export const esp32Service = new ESP32Service();

// Compatibilidade com turbidityService
export const turbidityService = {
  getTurbidityData: () => esp32Service.getTurbidityData(),
};