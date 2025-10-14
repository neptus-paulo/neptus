import { useCallback, useEffect, useState } from "react";

import { bluetoothService, SensorData } from "@/services/bluetooth-service";
import { useBluetoothConfigStore } from "@/stores/bluetoothConfigStore";

interface UseBluetoothSensorDataReturn {
  sensorData: SensorData | null;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isSupported: boolean;
}

export const useBluetoothSensorData = (): UseBluetoothSensorDataReturn => {
  const { config, setConnectionStatus } = useBluetoothConfigStore();

  const isSupported = bluetoothService.isBluetoothSupported();

  // Inicializa com o estado atual do serviço (importante para quando navega entre páginas)
  const currentStatus = bluetoothService.getConnectionStatus();
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(currentStatus.isConnected);
  const [error, setError] = useState<string | null>(null);

  // Sincroniza o estado inicial quando o componente monta
  useEffect(() => {
    const status = bluetoothService.getConnectionStatus();
    setIsConnected(status.isConnected);

    if (status.isConnected) {
      console.log("🔄 Conexão Bluetooth existente detectada");
      setError(null);
    }
  }, []);

  // Monitora dados recebidos via Bluetooth
  useEffect(() => {
    const unsubscribeData = bluetoothService.onDataReceived((data) => {
      setSensorData(data);
      setError(null);
    });

    return unsubscribeData;
  }, []);

  // Monitora status de conexão
  useEffect(() => {
    console.log("🎯 Montando monitor de status Bluetooth");

    // Verifica o status atual imediatamente
    const currentStatus = bluetoothService.getConnectionStatus();
    console.log("📊 Status atual ao montar:", currentStatus.isConnected);
    setIsConnected(currentStatus.isConnected);

    if (currentStatus.isConnected) {
      console.log("✅ Bluetooth já conectado ao montar hook");
      setConnectionStatus({
        isConnected: true,
        deviceName: currentStatus.device?.name,
        lastConnection: new Date(),
      });
      setError(null);
    }

    // Inscreve para mudanças futuras
    const unsubscribeStatus = bluetoothService.onStatusChange((status) => {
      console.log("🔄 Status de conexão mudou:", status.isConnected);
      setIsConnected(status.isConnected);

      // Atualiza o store
      setConnectionStatus({
        isConnected: status.isConnected,
        deviceName: status.device?.name,
        lastConnection: status.isConnected ? new Date() : undefined,
      });

      if (!status.isConnected) {
        setError("Dispositivo desconectado");
      } else {
        setError(null);
      }
    });

    return () => {
      console.log("🧹 Desmontando monitor de status Bluetooth");
      unsubscribeStatus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Array vazio - só executa uma vez ao montar, setConnectionStatus é estável do Zustand

  const connect = useCallback(async () => {
    if (!isSupported) {
      setError("Web Bluetooth não é suportado neste navegador");
      return;
    }

    if (!config.isConfigured) {
      setError("Bluetooth não está configurado");
      return;
    }

    // Verifica se já está conectado ANTES de tentar conectar
    const currentStatus = bluetoothService.getConnectionStatus();
    if (currentStatus.isConnected) {
      console.log("✅ Já está conectado ao Bluetooth - ignorando nova conexão");
      setIsConnected(true);
      setError(null);
      setConnectionStatus({
        isConnected: true,
        deviceName: currentStatus.device?.name,
        lastConnection: new Date(),
      });
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Configura o serviço com os dados salvos
      bluetoothService.setConfig(
        config.serviceUUID,
        config.characteristicUUID,
        config.deviceName
      );

      const success = await bluetoothService.connect();

      if (success) {
        console.log("✅ Conectado via Bluetooth");
        setIsConnected(true);
        setError(null);
      } else {
        setError("Falha ao conectar com o dispositivo");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";

      // Se o usuário cancelou, não mostra como erro
      if (
        errorMessage.includes("cancelled") ||
        errorMessage.includes("canceled")
      ) {
        console.log("ℹ️ Usuário cancelou a seleção de dispositivo");
        setError(null);
      } else {
        setError(errorMessage);
        console.error("❌ Erro ao conectar Bluetooth:", err);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [config, isSupported, setConnectionStatus]);

  const disconnect = useCallback(async () => {
    try {
      await bluetoothService.disconnect();
      setSensorData(null);
      setError(null);
      console.log("🔌 Desconectado do Bluetooth");
    } catch (err) {
      console.error("❌ Erro ao desconectar:", err);
    }
  }, []);

  // Auto-conecta se estiver configurado e não conectado
  // REMOVIDO: não conecta automaticamente, apenas quando o usuário clicar
  // useEffect(() => {
  //   if (config.isConfigured && !isConnected && !isConnecting && isSupported) {
  //     const timer = setTimeout(() => {
  //       connect();
  //     }, 1000);

  //     return () => clearTimeout(timer);
  //   }
  // }, [config.isConfigured, isConnected, isConnecting, isSupported, connect]);

  return {
    sensorData,
    isConnecting,
    isConnected,
    error,
    connect,
    disconnect,
    isSupported,
  };
};
