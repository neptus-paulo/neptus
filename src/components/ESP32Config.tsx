"use client";

import { Settings, Wifi, WifiOff } from "lucide-react";
import { useState } from "react";

import AppButton from "@/components/AppButton";
import { esp32Service } from "@/services/esp32-service";
import { useESP32ConfigStore } from "@/stores/esp32ConfigStore";

import { Input } from "./ui/input";

interface ESP32ConfigProps {
  onConfigSaved?: () => void;
}

export default function ESP32Config({ onConfigSaved }: ESP32ConfigProps) {
  const { config, setConfig, clearConfig } = useESP32ConfigStore();
  const [ip, setIp] = useState(config.ip);
  const [port, setPort] = useState(config.port);
  const [endpoint, setEndpoint] = useState(config.endpoint);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "testing" | "success" | "error"
  >("idle");

  const handleTestConnection = async () => {
    if (!ip.trim()) {
      alert("Por favor, digite o IP do ESP32");
      return;
    }

    setIsLoading(true);
    setConnectionStatus("testing");

    try {
      const isConnected = await esp32Service.testConnection(
        ip.trim(),
        endpoint.trim(),
        port.trim()
      );

      console.log("Conexão testada:", isConnected);

      if (isConnected) {
        setConnectionStatus("success");
        setConfig(ip.trim(), port.trim(), endpoint.trim());
        onConfigSaved?.();
        alert("Conexão com ESP32 estabelecida com sucesso!");
      } else {
        setConnectionStatus("error");
        alert(
          "Não foi possível conectar ao ESP32. Verifique o IP e se o dispositivo está ligado."
        );
      }
    } catch (error) {
      setConnectionStatus("error");
      alert("Erro ao testar conexão. Verifique se o ESP32 está na mesma rede.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearConfig = () => {
    clearConfig();
    setIp("");
    setPort("3000");
    setEndpoint("api/turbidez");
    setConnectionStatus("idle");
    alert("Configuração do ESP32 removida");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Configuração do ESP32</h2>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            IP do ESP32 *
          </label>
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
                {connectionStatus === "success"
                  ? "Conectado"
                  : "Testar Conexão"}
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

        {config.isConfigured && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              <strong>ESP32 configurado:</strong> {config.ip}
              {config.port ? `:${config.port}` : ""}
              {config.endpoint ? `/${config.endpoint}` : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
