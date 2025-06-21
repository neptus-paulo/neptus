import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ESP32Config {
  ip: string;
  port: string;
  endpoint: string;
  isConfigured: boolean;
}

interface ESP32ConfigStore {
  config: ESP32Config;
  setConfig: (ip: string, port?: string, endpoint?: string) => void;
  clearConfig: () => void;
  getFullUrl: () => string;
}

const defaultConfig: ESP32Config = {
  ip: "",
  port: "",
  endpoint: "",
  isConfigured: false,
};

export const useESP32ConfigStore = create<ESP32ConfigStore>()(
  persist(
    (set, get) => ({
      config: defaultConfig,

      setConfig: (ip: string, port: string = "", endpoint: string = "") => {
        set({
          config: {
            ip: ip.trim(),
            port: port.trim(),
            endpoint: endpoint.trim(),
            isConfigured: true,
          },
        });
      },

      clearConfig: () => {
        set({ config: defaultConfig });
      },

      getFullUrl: () => {
        const { config } = get();
        if (!config.isConfigured || !config.ip) {
          return "";
        }
        return `http://${config.ip}:${config.port ? `:${config.port}` : ""}/${
          config.endpoint
        }`;
      },
    }),
    {
      name: "esp32-config-storage",
    }
  )
);
