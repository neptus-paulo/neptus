"use client";

import { Wifi, WifiOff } from "lucide-react";
import { useState } from "react";

import AppButton from "@/components/AppButton";
import Header from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TurbidityResponse {
  turbidez?: number;
  qualidade?: string;
  timestamp?: string;
  error?: string;
}

const TestPage = () => {
  const [ipAddress, setIpAddress] = useState("192.168.1.100");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<TurbidityResponse | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  const testConnection = async () => {
    if (!ipAddress.trim()) {
      alert("Por favor, insira um endereço IP válido");
      return;
    }

    setIsLoading(true);
    setResponse(null);
    setIsConnected(null);

    try {
      const url = `http://${ipAddress}/turbidez`;
      console.log("Fazendo requisição para:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Timeout de 5 segundos
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        setResponse(data);
        setIsConnected(true);
        setLastUpdate(new Date().toLocaleTimeString());
      } else {
        setResponse({
          error: `Erro HTTP: ${response.status} - ${response.statusText}`,
        });
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Erro na conexão:", error);
      setResponse({
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    if (isConnected === null) return "secondary";
    return isConnected ? "default" : "destructive";
  };

  const getStatusText = () => {
    if (isConnected === null) return "Não testado";
    return isConnected ? "Conectado" : "Desconectado";
  };

  return (
    <>
      <Header />
      <main className="p-5 space-y-6 max-w-2xl mx-auto">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Teste de Conexão ESP32</h1>
          <p className="text-muted-foreground">
            Teste a conexão HTTP com seu dispositivo ESP32
          </p>
        </div>

        {/* Formulário de conexão */}
        <div className="space-y-4 p-6 border rounded-lg bg-muted/50">
          <div className="space-y-2">
            <Label htmlFor="ip-input">Endereço IP do ESP32</Label>
            <Input
              id="ip-input"
              type="text"
              placeholder="192.168.1.100"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">
              URL de teste: http://{ipAddress || "IP"}/turbidez
            </p>
          </div>

          <AppButton
            onClick={testConnection}
            disabled={isLoading || !ipAddress.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Testando conexão...
              </>
            ) : (
              <>
                <Wifi size={16} />
                Testar Conexão
              </>
            )}
          </AppButton>
        </div>

        {/* Status da conexão */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Status da Conexão</h2>
            <Badge
              variant={getStatusColor()}
              className="flex items-center gap-1"
            >
              {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
              {getStatusText()}
            </Badge>
          </div>

          {lastUpdate && (
            <p className="text-sm text-muted-foreground">
              Última atualização: {lastUpdate}
            </p>
          )}
        </div>

        {/* Resultados */}
        {response && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Resposta do ESP32</h2>

            {response.error ? (
              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <h3 className="font-medium text-red-800 mb-2">
                  Erro na Conexão
                </h3>
                <p className="text-red-700 text-sm">{response.error}</p>

                <div className="mt-3 text-sm text-red-600">
                  <p>
                    <strong>Possíveis causas:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    <li>ESP32 não está ligado ou conectado à rede</li>
                    <li>Endereço IP incorreto</li>
                    <li>Firewall bloqueando a conexão</li>
                    <li>ESP32 não configurado corretamente</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                <h3 className="font-medium text-green-800 mb-3">
                  Dados Recebidos
                </h3>

                <div className="space-y-2">
                  {response.turbidez !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-green-700">Turbidez:</span>
                      <span className="font-mono text-green-800">
                        {response.turbidez} NTU
                      </span>
                    </div>
                  )}

                  {response.qualidade && (
                    <div className="flex justify-between">
                      <span className="text-green-700">Qualidade:</span>
                      <span className="font-medium text-green-800">
                        {response.qualidade}
                      </span>
                    </div>
                  )}

                  {response.timestamp && (
                    <div className="flex justify-between">
                      <span className="text-green-700">Timestamp:</span>
                      <span className="font-mono text-green-800">
                        {response.timestamp}
                      </span>
                    </div>
                  )}
                </div>

                {/* JSON Raw */}
                <details className="mt-4">
                  <summary className="cursor-pointer text-green-700 hover:text-green-800">
                    Ver JSON completo
                  </summary>
                  <pre className="mt-2 p-3 bg-green-100 rounded text-xs overflow-x-auto">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        )}

        {/* Informações de ajuda */}
        <div className="p-4 border rounded-lg bg-blue-50">
          <h3 className="font-medium text-blue-800 mb-2">
            Configuração do ESP32
          </h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>Certifique-se de que seu ESP32:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Está conectado à mesma rede Wi-Fi</li>
              <li>Tem um servidor HTTP rodando na porta 80</li>
              <li>Responde à rota GET /turbidez</li>
              <li>Retorna dados em formato JSON</li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
};

export default TestPage;
