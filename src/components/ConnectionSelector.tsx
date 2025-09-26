"use client";

import { Bluetooth, Settings, Wifi } from "lucide-react";
import { useState } from "react";

import AppButton from "@/components/AppButton";
import BluetoothConnector from "@/components/BluetoothConnector";
import ESP32Config from "@/components/ESP32Config";

export type ConnectionType = "wifi" | "bluetooth";

interface ConnectionSelectorProps {
  connectionType: ConnectionType;
  onConnectionTypeChange: (type: ConnectionType) => void;
  onConfigurationChange?: () => void;
}

export default function ConnectionSelector({
  connectionType,
  onConnectionTypeChange,
  onConfigurationChange,
}: ConnectionSelectorProps) {
  const [showWifiConfig, setShowWifiConfig] = useState(false);

  const handleWifiConfigSaved = () => {
    setShowWifiConfig(false);
    onConfigurationChange?.();
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Método de Conexão
        </h3>
        <p className="text-sm text-blue-800 mb-4">
          Escolha como deseja se conectar ao ESP32 para receber os dados de turbidez.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {/* Opção Wi-Fi */}
          <div
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              connectionType === "wifi"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-white hover:border-gray-400"
            }`}
            onClick={() => onConnectionTypeChange("wifi")}
          >
            <div className="flex items-center gap-3">
              <Wifi className={`h-6 w-6 ${connectionType === "wifi" ? "text-blue-600" : "text-gray-600"}`} />
              <div>
                <h4 className={`font-medium ${connectionType === "wifi" ? "text-blue-900" : "text-gray-900"}`}>
                  Wi-Fi (HTTP)
                </h4>
                <p className={`text-sm ${connectionType === "wifi" ? "text-blue-700" : "text-gray-600"}`}>
                  Conexão via rede local
                </p>
              </div>
            </div>
          </div>

          {/* Opção Bluetooth */}
          <div
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              connectionType === "bluetooth"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-white hover:border-gray-400"
            }`}
            onClick={() => onConnectionTypeChange("bluetooth")}
          >
            <div className="flex items-center gap-3">
              <Bluetooth className={`h-6 w-6 ${connectionType === "bluetooth" ? "text-blue-600" : "text-gray-600"}`} />
              <div>
                <h4 className={`font-medium ${connectionType === "bluetooth" ? "text-blue-900" : "text-gray-900"}`}>
                  Bluetooth (BLE)
                </h4>
                <p className={`text-sm ${connectionType === "bluetooth" ? "text-blue-700" : "text-gray-600"}`}>
                  Conexão direta via Bluetooth
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interface específica para cada tipo de conexão */}
        {connectionType === "wifi" ? (
          <AppButton
            onClick={() => setShowWifiConfig(true)}
            variant="outline"
            className="w-full"
          >
            <Settings className="h-4 w-4 mr-2" />
            Configurar Wi-Fi
          </AppButton>
        ) : (
          <BluetoothConnector />
        )}
      </div>

      {/* Modal de configuração Wi-Fi */}
      <ESP32Config
        isOpen={showWifiConfig}
        onClose={() => setShowWifiConfig(false)}
        onConfigSaved={handleWifiConfigSaved}
        onSuccess={handleWifiConfigSaved}
      />
    </div>
  );
}