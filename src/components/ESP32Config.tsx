"use client";

import { Settings, Wifi, WifiOff, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import AppButton from "@/components/AppButton";
import { restartConnectionChecks } from "@/hooks/useOnlineStatus";
import { esp32Service } from "@/services/esp32-service";
import { useESP32ConfigStore } from "@/stores/esp32ConfigStore";

import { Input } from "./ui/input";

interface ESP32Config {
  ip: string;
  port: string;
  endpoint: string;
  isConfigured: boolean;
}

interface ESP32ConfigProps {
  onConfigSaved?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  isRequired?: boolean;
}

export default function ESP32Config({
  onConfigSaved,
  isOpen = false,
  onClose,
  onSuccess,
  isRequired = false,
}: ESP32ConfigProps) {
  const { config, setConfig, clearConfig } = useESP32ConfigStore();
  const [ip, setIp] = useState(config.ip);
  const [port, setPort] = useState(config.port);
  const [endpoint, setEndpoint] = useState(config.endpoint);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "testing" | "success" | "error"
  >("idle");

  useEffect(() => {
    if (isOpen) {
      console.log("🔧 Modal aberto - sincronizando com store:", config);
      setIp(config.ip);
      setPort(config.port);
      setEndpoint(config.endpoint);
    }
  }, [isOpen, config]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  const handleTestConnection = async () => {
    if (!ip.trim()) {
      setConnectionStatus("error");
      return;
    }

    setIsLoading(true);
    setConnectionStatus("testing");

    setConfig(ip.trim(), port.trim(), endpoint.trim());

    try {
      const isConnected = await esp32Service.testConnection(
        ip.trim(),
        endpoint.trim(),
        port.trim()
      );

      console.log("Conexão testada:", isConnected);

      if (isConnected) {
        setConnectionStatus("success");
        console.log("💾 Configuração salva:", {
          ip: ip.trim(),
          port: port.trim(),
          endpoint: endpoint.trim(),
        });
        restartConnectionChecks();
        onConfigSaved?.();
        onSuccess?.();
      } else {
        setConnectionStatus("error");
      }
    } catch (error) {
      setConnectionStatus("error");
      console.error("Erro ao testar conexão:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearConfig = () => {
    console.log("🗑️ Limpando configuração");
    clearConfig();
    setIp("");
    setPort("");
    setEndpoint("");
    setConnectionStatus("idle");
    restartConnectionChecks();
  };

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-background rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-background rounded-t-lg">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Configurar ESP32
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="p-4">
          <ConfigurationContent
            config={config}
            ip={ip}
            port={port}
            endpoint={endpoint}
            setIp={setIp}
            setPort={setPort}
            setEndpoint={setEndpoint}
            isLoading={isLoading}
            connectionStatus={connectionStatus}
            handleTestConnection={handleTestConnection}
            handleClearConfig={handleClearConfig}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isOpen &&
        typeof window !== "undefined" &&
        createPortal(modalContent, document.body)}
    </>
  );
}

function ConfigurationContent({
  config,
  ip,
  port,
  endpoint,
  setIp,
  setPort,
  setEndpoint,
  isLoading,
  connectionStatus,
  handleTestConnection,
  handleClearConfig,
}: {
  config: ESP32Config;
  ip: string;
  port: string;
  endpoint: string;
  setIp: (value: string) => void;
  setPort: (value: string) => void;
  setEndpoint: (value: string) => void;
  isLoading: boolean;
  connectionStatus: string;
  handleTestConnection: () => void;
  handleClearConfig: () => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">IP do ESP32 *</label>
        <Input
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="192.168.1.100"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Digite o IP do ESP32 na sua rede local
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Porta (opcional)
        </label>
        <Input
          type="number"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          placeholder="3000"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Endpoint (opcional)
        </label>
        <Input
          type="text"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          placeholder="api/turbidez"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Endpoint para acessar os dados do ESP32
        </p>
      </div>

      <div className="flex gap-2">
        <AppButton
          onClick={handleTestConnection}
          disabled={isLoading || !ip.trim()}
          className="flex-1"
        >
          {connectionStatus === "testing" ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Testando...
            </>
          ) : (
            <>
              {connectionStatus === "success" ? (
                <Wifi className="w-4 h-4 mr-2" />
              ) : connectionStatus === "error" ? (
                <WifiOff className="w-4 h-4 mr-2" />
              ) : (
                <Wifi className="w-4 h-4 mr-2" />
              )}
              {connectionStatus === "success" ? "Conectado" : "Testar Conexão"}
            </>
          )}
        </AppButton>

        {config.isConfigured && (
          <AppButton
            variant="outline"
            onClick={handleClearConfig}
            disabled={isLoading}
          >
            Limpar
          </AppButton>
        )}
      </div>

      {config.isConfigured && connectionStatus === "success" && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">
            <strong>✓ ESP32 conectado com sucesso:</strong> {config.ip}
            {config.port ? `:${config.port}` : ""}
            {config.endpoint ? `/${config.endpoint}` : ""}
          </p>
        </div>
      )}

      {connectionStatus === "error" && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">
            <strong>✗ Erro na conexão:</strong> Verifique o IP, porta e se o
            ESP32 está ligado na mesma rede.
          </p>
        </div>
      )}

      {connectionStatus === "testing" && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>🔄 Testando conexão...</strong> Aguarde um momento.
          </p>
        </div>
      )}
    </div>
  );
}
