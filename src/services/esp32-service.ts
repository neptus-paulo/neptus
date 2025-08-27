import axios from "axios";

import { useESP32ConfigStore } from "@/stores/esp32ConfigStore";

export interface ESP32Data {
  turbidez: number;
  temperatura?: number;
  ph?: number;
  timestamp: string;
}

class ESP32Service {
  async testConnection(
    ip: string,
    endpoint: string = "turbidez",
    port: string = ""
  ): Promise<boolean> {
    try {
      const portSuffix = port ? `:${port}` : "";
      const cleanEndpoint = endpoint.replace(/^\/+/, "");
      const url = `http://${ip}${portSuffix}/${cleanEndpoint}`;

      console.log("🔍 Testando conexão com:", url);

      const response = await axios.get(url, {
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
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

  async getData(
    ip: string,
    endpoint: string = "turbidez",
    port: string = ""
  ): Promise<ESP32Data> {
    try {
      const portSuffix = port ? `:${port}` : "";
      const cleanEndpoint = endpoint.replace(/^\/+/, "");
      const url = `http://${ip}${portSuffix}/${cleanEndpoint}`;

      console.log("🌊 Buscando dados de:", url);

      const response = await axios.get(url, {
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("📊 Dados recebidos:", response.data);

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
