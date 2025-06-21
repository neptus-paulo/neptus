import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SensorReading {
  voltagem: number;
  turbidez: number;
  nivel: string;
  timestamp: number;
}

interface SavedReading extends SensorReading {
  id: string;
  synced: boolean;
}

interface OfflineDataState {
  cachedSensorData: SensorReading | null;
  savedReadings: SavedReading[];
  lastSync: number | null;

  // Actions
  setCachedSensorData: (data: SensorReading) => void;
  saveReading: (reading: SensorReading) => string;
  markReadingAsSynced: (id: string) => void;
  getUnsyncedReadings: () => SavedReading[];
  clearSyncedReadings: () => void;
  setLastSync: (timestamp: number) => void;
}

export const useOfflineDataStore = create<OfflineDataState>()(
  persist(
    (set, get) => ({
      cachedSensorData: null,
      savedReadings: [],
      lastSync: null,

      setCachedSensorData: (data: SensorReading) => {
        set({ cachedSensorData: data });
      },

      saveReading: (reading: SensorReading) => {
        const id = `reading_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const savedReading: SavedReading = {
          ...reading,
          id,
          synced: false,
        };

        set((state) => ({
          savedReadings: [...state.savedReadings, savedReading],
        }));

        return id;
      },

      markReadingAsSynced: (id: string) => {
        set((state) => ({
          savedReadings: state.savedReadings.map((reading) =>
            reading.id === id ? { ...reading, synced: true } : reading
          ),
        }));
      },

      getUnsyncedReadings: () => {
        return get().savedReadings.filter((reading) => !reading.synced);
      },

      clearSyncedReadings: () => {
        set((state) => ({
          savedReadings: state.savedReadings.filter(
            (reading) => !reading.synced
          ),
        }));
      },

      setLastSync: (timestamp: number) => {
        set({ lastSync: timestamp });
      },
    }),
    {
      name: "offline-data-storage",
    }
  )
);
