import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ConnectionType = "wifi" | "bluetooth";

interface ConnectionStore {
  connectionType: ConnectionType;
  setConnectionType: (type: ConnectionType) => void;
}

export const useConnectionStore = create<ConnectionStore>()(
  persist(
    (set) => ({
      connectionType: "bluetooth" as ConnectionType, // Bluetooth como padrão
      
      setConnectionType: (type: ConnectionType) => {
        set({ connectionType: type });
      },
    }),
    {
      name: "connection-type-storage",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);