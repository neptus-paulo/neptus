"use client";

import { CheckCircle, Upload, Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useOfflineDataStore } from "@/stores/offlineDataStore";

/**
 * Component to handle data synchronization when coming back online
 */
export default function DataSyncManager() {
  const isOnline = useOnlineStatus();
  const { getUnsyncedReadings, markReadingAsSynced, clearSyncedReadings } =
    useOfflineDataStore();
  const [syncStatus, setSyncStatus] = useState<
    "idle" | "syncing" | "synced" | "error"
  >("idle");
  const [unsyncedCount, setUnsyncedCount] = useState(0);

  // Update unsynced count
  useEffect(() => {
    const unsynced = getUnsyncedReadings();
    setUnsyncedCount(unsynced.length);
  }, [getUnsyncedReadings]);

  // Auto-sync when coming back online
  useEffect(() => {
    const syncData = async () => {
      const unsyncedReadings = getUnsyncedReadings();

      if (unsyncedReadings.length === 0) {
        return;
      }

      setSyncStatus("syncing");

      try {
        // TODO: Replace with actual API call
        // Simulate API sync
        for (const reading of unsyncedReadings) {
          // Simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          // In a real implementation, you would send each reading to your API
          // const response = await fetch('/api/sensor-readings', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify(reading),
          // });

          // if (response.ok) {
          markReadingAsSynced(reading.id);
          // }
        }

        setSyncStatus("synced");

        // Clear synced readings after a delay
        setTimeout(() => {
          clearSyncedReadings();
          setSyncStatus("idle");
        }, 3000);
      } catch (error) {
        console.error("Sync failed:", error);
        setSyncStatus("error");

        // Reset status after showing error
        setTimeout(() => {
          setSyncStatus("idle");
        }, 3000);
      }
    };

    if (isOnline && unsyncedCount > 0) {
      syncData();
    }
  }, [
    isOnline,
    unsyncedCount,
    getUnsyncedReadings,
    markReadingAsSynced,
    clearSyncedReadings,
  ]);

  const manualSync = async () => {
    const unsyncedReadings = getUnsyncedReadings();

    if (unsyncedReadings.length === 0) {
      return;
    }

    setSyncStatus("syncing");

    try {
      // TODO: Replace with actual API call
      // Simulate API sync
      for (const reading of unsyncedReadings) {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // In a real implementation, you would send each reading to your API
        // const response = await fetch('/api/sensor-readings', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(reading),
        // });

        // if (response.ok) {
        markReadingAsSynced(reading.id);
        // }
      }

      setSyncStatus("synced");

      // Clear synced readings after a delay
      setTimeout(() => {
        clearSyncedReadings();
        setSyncStatus("idle");
      }, 3000);
    } catch (error) {
      console.error("Sync failed:", error);
      setSyncStatus("error");

      // Reset status after showing error
      setTimeout(() => {
        setSyncStatus("idle");
      }, 3000);
    }
  };

  // Don't show anything if there's nothing to sync
  if (unsyncedCount === 0 && syncStatus === "idle") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-3 flex items-center gap-2 text-sm">
        {syncStatus === "syncing" && (
          <>
            <Upload className="w-4 h-4 animate-spin text-blue-500" />
            <span>Sincronizando {unsyncedCount} leituras...</span>
          </>
        )}

        {syncStatus === "synced" && (
          <>
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Dados sincronizados!</span>
          </>
        )}

        {syncStatus === "error" && (
          <>
            <WifiOff className="w-4 h-4 text-red-500" />
            <span>Erro na sincronização</span>
          </>
        )}

        {syncStatus === "idle" && unsyncedCount > 0 && (
          <>
            <Wifi className="w-4 h-4 text-orange-500" />
            <span>{unsyncedCount} leituras pendentes</span>
            {isOnline && (
              <button
                onClick={manualSync}
                className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
              >
                Sincronizar
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
