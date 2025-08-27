"use client";

import { useEffect, useState } from "react";

import ESP32Config from "@/components/ESP32Config";
import {
  useOnlineStatus,
  validateAndStartConnection,
} from "@/hooks/useOnlineStatus";
import { useESP32ConfigStore } from "@/stores/esp32ConfigStore";

interface ConfigurationGuardProps {
  children: React.ReactNode;
}

export function ConfigurationGuard({ children }: ConfigurationGuardProps) {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { config } = useESP32ConfigStore();
  const { needsConfiguration, connectionState } = useOnlineStatus();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);

      if (needsConfiguration || connectionState === "failed") {
        setShowConfigModal(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [needsConfiguration, connectionState]);

  useEffect(() => {
    if (isInitialized && (needsConfiguration || connectionState === "failed")) {
      setShowConfigModal(true);
    } else if (connectionState === "connected") {
      setShowConfigModal(false);
    }
  }, [isInitialized, needsConfiguration, connectionState]);

  const handleConfigSuccess = async () => {
    const success = await validateAndStartConnection();
    if (success) {
      setShowConfigModal(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Inicializando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}

      <ESP32Config
        isOpen={showConfigModal}
        onClose={() => {
          if (connectionState === "connected") {
            setShowConfigModal(false);
          }
        }}
        onSuccess={handleConfigSuccess}
        isRequired={needsConfiguration || connectionState === "failed"}
      />
    </>
  );
}
