export interface SensorData {
  turbidez: number;
  temperatura?: number;
  ph?: number;
}

export interface ESP32Data extends SensorData {
  timestamp: string;
}

export interface BluetoothConfig {
  serviceUUID: string;
  characteristicUUID: string;
  deviceName?: string;
  isConfigured: boolean;
}

export interface BluetoothConnectionStatus {
  isConnected: boolean;
  device: BluetoothDevice | null;
  server: BluetoothRemoteGATTServer | null;
  characteristic: BluetoothRemoteGATTCharacteristic | null;
}

class BluetoothService {
  private config: BluetoothConfig = {
    serviceUUID: "12345678-1234-5678-1234-56789abcdef0",
    characteristicUUID: "abcdefab-1234-5678-1234-56789abcdef0",
    deviceName: "ESP32-Neptus",
    isConfigured: false,
  };

  private connectionStatus: BluetoothConnectionStatus = {
    isConnected: false,
    device: null,
    server: null,
    characteristic: null,
  };

  private dataCallbacks: ((data: SensorData) => void)[] = [];
  private statusCallbacks: ((status: BluetoothConnectionStatus) => void)[] = [];

  constructor() {
    // Verifica se o navegador suporta Web Bluetooth
    if (!navigator.bluetooth) {
      console.error("❌ Web Bluetooth não é suportado neste navegador");
    }

    // Configuração para o protocolo NUS (Nordic UART Service)
    this.config = {
      serviceUUID: "6e400001-b5a3-f393-e0a9-e50e24dcca9e", // NUS Service UUID
      characteristicUUID: "6e400003-b5a3-f393-e0a9-e50e24dcca9e", // NUS TX Characteristic UUID
      deviceName: "ESP32-Turbidez", // Nome que o ESP32 anuncia
      isConfigured: true, // Já vem configurado por padrão
    };
  }

  // Verifica se o navegador suporta Web Bluetooth
  isBluetoothSupported(): boolean {
    // Verifica se a API está disponível
    const hasBluetoothAPI = !!navigator.bluetooth;

    // Verifica se está em contexto seguro (HTTPS ou localhost)
    const isSecureContext =
      window.isSecureContext ||
      location.protocol === "https:" ||
      location.hostname === "localhost" ||
      location.hostname === "127.0.0.1";

    return hasBluetoothAPI && isSecureContext;
  }

  // Obtém informações sobre por que o Bluetooth não está disponível
  getBluetoothUnavailabilityReason(): string {
    if (!navigator.bluetooth) {
      return "Este navegador não suporta Web Bluetooth. Use Chrome, Edge ou outro navegador compatível.";
    }

    if (
      !window.isSecureContext &&
      location.protocol !== "https:" &&
      location.hostname !== "localhost" &&
      location.hostname !== "127.0.0.1"
    ) {
      return 'Web Bluetooth requer HTTPS ou localhost. Para testar via rede local, use "localhost" ou configure HTTPS.';
    }

    return "Web Bluetooth pode estar desabilitado. Verifique chrome://flags/#enable-web-bluetooth e habilite a funcionalidade.";
  }

  // Verifica especificamente se o Bluetooth está disponível e dá instruções detalhadas
  async checkBluetoothAvailability(): Promise<{
    available: boolean;
    reason?: string;
    instructions?: string[];
  }> {
    if (!navigator.bluetooth) {
      return {
        available: false,
        reason: "Web Bluetooth API não encontrada",
        instructions: [
          "Use Chrome 56+ ou Edge 79+",
          "Certifique-se de que está em um navegador compatível",
          "Baixe Chrome Canary para funcionalidades experimentais",
        ],
      };
    }

    try {
      // Tenta verificar se o Bluetooth está disponível no dispositivo
      const available = await navigator.bluetooth.getAvailability();

      if (!available) {
        return {
          available: false,
          reason: "Bluetooth não disponível no dispositivo",
          instructions: [
            "Verifique se o Bluetooth está ligado no seu dispositivo",
            "Certifique-se de que o dispositivo suporta Bluetooth Low Energy",
            "Reinicie o navegador e tente novamente",
          ],
        };
      }

      return { available: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (
        errorMessage.includes("globally disabled") ||
        errorMessage.includes("disabled")
      ) {
        return {
          available: false,
          reason: "Web Bluetooth está desabilitado no navegador",
          instructions: [
            "Abra chrome://flags/#enable-web-bluetooth",
            'Mude para "Enabled"',
            "Reinicie o navegador",
            "Também habilite chrome://flags/#enable-experimental-web-platform-features",
          ],
        };
      }

      if (!window.isSecureContext) {
        return {
          available: false,
          reason: "Contexto não seguro (requer HTTPS)",
          instructions: [
            "Use https:// em vez de http://",
            "Para desenvolvimento local, use localhost",
            "Configure certificado SSL para desenvolvimento",
            "Use ngrok para criar túnel HTTPS",
          ],
        };
      }

      return {
        available: false,
        reason: `Erro: ${errorMessage}`,
        instructions: [
          "Verifique as configurações do navegador",
          "Reinicie o navegador",
          "Certifique-se de que está usando um navegador compatível",
        ],
      };
    }
  }

  // Configura os UUIDs do serviço e característica
  setConfig(
    serviceUUID: string,
    characteristicUUID: string,
    deviceName?: string
  ) {
    this.config = {
      serviceUUID: serviceUUID.trim(),
      characteristicUUID: characteristicUUID.trim(),
      deviceName: deviceName?.trim(),
      isConfigured: true,
    };
  }

  // Obtém a configuração atual
  getConfig(): BluetoothConfig {
    return { ...this.config };
  }

  // Limpa a configuração
  clearConfig() {
    this.config = {
      serviceUUID: "12345678-1234-5678-1234-56789abcdef0",
      characteristicUUID: "abcdefab-1234-5678-1234-56789abcdef0",
      deviceName: "ESP32-Neptus",
      isConfigured: false,
    };
  }

  // Função para debug - escaneia dispositivos disponíveis
  async scanAvailableDevices(): Promise<void> {
    try {
      // Busca geral por qualquer dispositivo BLE
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          this.config.serviceUUID,
          "0000180f-0000-1000-8000-00805f9b34fb",
        ], // Inclui Battery Service como exemplo
      });

      console.log("📱 Dispositivo encontrado:", {
        name: device.name,
        id: device.id,
        gatt: device.gatt,
      });

      if (device.gatt) {
        const server = await device.gatt.connect();

        // Lista todos os serviços
        const services = await server.getPrimaryServices();
        console.log("📋 Serviços disponíveis:");
        services.forEach((service) => {
          console.log(`  - ${service.uuid}`);
        });

        await device.gatt.disconnect();
      }
    } catch (error) {
      console.log("❌ Erro no scan:", error);
    }
  }

  // Conecta ao dispositivo ESP32 via Bluetooth (usando a mesma lógica que funciona no debug)
  async connect(): Promise<boolean> {
    try {
      if (!this.isBluetoothSupported()) {
        throw new Error("Web Bluetooth não é suportado neste navegador");
      }

      // EXATAMENTE a mesma lógica do testServiceFilter que funciona
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [this.config.serviceUUID] }],
        optionalServices: [this.config.serviceUUID],
      });

      // Adiciona listener para desconexão
      device.addEventListener(
        "gattserverdisconnected",
        this.handleDisconnection.bind(this)
      );

      // Conecta ao GATT Server
      const server = await device.gatt!.connect();

      // Pega o serviço
      const service = await server.getPrimaryService(this.config.serviceUUID);

      // Pega a característica
      const characteristic = await service.getCharacteristic(
        this.config.characteristicUUID
      );

      // Ativa notificações
      await characteristic.startNotifications();

      // Adiciona listener para dados
      characteristic.addEventListener(
        "characteristicvaluechanged",
        this.handleDataReceived.bind(this)
      );

      // Atualiza status da conexão
      this.connectionStatus = {
        isConnected: true,
        device,
        server,
        characteristic,
      };

      this.notifyStatusChange();

      return true;
    } catch (error) {
      console.error("❌ Erro na conexão Bluetooth:", error);
      this.connectionStatus = {
        isConnected: false,
        device: null,
        server: null,
        characteristic: null,
      };
      this.notifyStatusChange();
      throw error;
    }
  }

  // Método alternativo para listar todos os dispositivos (debug)
  async connectWithGeneralScan(): Promise<boolean> {
    try {
      if (!this.isBluetoothSupported()) {
        throw new Error("Web Bluetooth não é suportado neste navegador");
      }

      // Busca qualquer dispositivo BLE
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [this.config.serviceUUID],
      });

      console.log("📱 Dispositivo selecionado:", {
        name: device.name,
        id: device.id,
      });

      // Tenta conectar
      return await this.connectToDevice(device);
    } catch (error) {
      console.error("❌ Erro na conexão geral:", error);
      throw error;
    }
  }

  // Método auxiliar para conectar a um dispositivo já selecionado
  private async connectToDevice(device: BluetoothDevice): Promise<boolean> {
    try {
      // Adiciona listener para desconexão
      device.addEventListener(
        "gattserverdisconnected",
        this.handleDisconnection.bind(this)
      );

      // Conecta ao GATT Server
      const server = await device.gatt!.connect();

      // Pega o serviço
      const service = await server.getPrimaryService(this.config.serviceUUID);

      // Pega a característica
      const characteristic = await service.getCharacteristic(
        this.config.characteristicUUID
      );

      // Ativa notificações
      await characteristic.startNotifications();

      // Adiciona listener para dados
      characteristic.addEventListener(
        "characteristicvaluechanged",
        this.handleDataReceived.bind(this)
      );

      // Atualiza status da conexão
      this.connectionStatus = {
        isConnected: true,
        device,
        server,
        characteristic,
      };

      this.notifyStatusChange();

      return true;
    } catch (error) {
      console.error("❌ Erro ao conectar com ESP32:", error);
      this.connectionStatus = {
        isConnected: false,
        device: null,
        server: null,
        characteristic: null,
      };
      this.notifyStatusChange();

      // Mensagens de erro mais amigáveis
      if (error instanceof Error) {
        if (error.message.includes("User cancelled")) {
          throw new Error("Conexão cancelada pelo usuário");
        } else if (error.message.includes("not found")) {
          throw new Error(
            "ESP32-Turbidez não encontrado. Verifique se está ligado e próximo."
          );
        }
      }

      throw error;
    }
  }

  // Desconecta do dispositivo
  async disconnect(): Promise<void> {
    try {
      if (this.connectionStatus.server?.connected) {
        this.connectionStatus.server.disconnect();
      }

      this.connectionStatus = {
        isConnected: false,
        device: null,
        server: null,
        characteristic: null,
      };

      this.notifyStatusChange();
    } catch (error) {
      console.error("❌ Erro ao desconectar:", error);
    }
  }

  // Manipula dados recebidos do ESP32
  private handleDataReceived(event: Event) {
    try {
      const target = event.target as BluetoothRemoteGATTCharacteristic;
      const value = target.value;

      if (!value) return;

      // O ESP32 envia dados como string JSON via protocolo NUS
      const decoder = new TextDecoder();
      const dataString = decoder.decode(value).trim();

      let turbidez: number = 0;
      let nivel: string | undefined;
      let timestamp: number | undefined;

      try {
        // Tenta fazer parsing do JSON (formato atual do ESP32)
        const jsonData = JSON.parse(dataString);
        console.log("📊 JSON decodificado:", jsonData);

        turbidez = jsonData.turbidez || 0;
        nivel = jsonData.nivel;
        timestamp = jsonData.timestamp;
      } catch (jsonError) {
        // Fallback: tenta converter diretamente para número
        const numericValue = parseFloat(dataString);

        if (!isNaN(numericValue)) {
          turbidez = numericValue;
        } else {
          console.warn("⚠️ Formato de dados não reconhecido:", dataString);
          return;
        }
      }

      const sensorData: SensorData = {
        turbidez,
        temperatura: undefined, // Pode ser expandido para outros sensores
        ph: undefined,
      };

      // Notifica todos os callbacks
      this.dataCallbacks.forEach((callback) => callback(sensorData));
    } catch (error) {
      console.error("❌ Erro ao processar dados Bluetooth:", error);
    }
  }

  // Manipula desconexão do dispositivo
  private handleDisconnection() {
    this.connectionStatus = {
      isConnected: false,
      device: null,
      server: null,
      characteristic: null,
    };
    this.notifyStatusChange();
  }

  // Testa a conexão (para compatibilidade com a interface atual)
  async testConnection(): Promise<boolean> {
    try {
      if (this.connectionStatus.isConnected) {
        return true;
      }

      return await this.connect();
    } catch (error) {
      console.error("❌ Teste de conexão Bluetooth falhou:", error);
      return false;
    }
  }

  // Obtém dados de turbidez (para compatibilidade)
  async getTurbidityData(): Promise<{ data: SensorData }> {
    if (!this.connectionStatus.isConnected) {
      throw new Error("Dispositivo Bluetooth não conectado");
    }

    // Como o Bluetooth usa notificações, não fazemos uma requisição ativa
    // Retornamos os últimos dados recebidos ou aguardamos por novos dados
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timeout aguardando dados do dispositivo"));
      }, 5000);

      const handleData = (data: SensorData) => {
        clearTimeout(timeout);
        resolve({ data });
        // Remove o callback temporário
        this.dataCallbacks = this.dataCallbacks.filter(
          (cb) => cb !== handleData
        );
      };

      this.dataCallbacks.push(handleData);
    });
  }

  // Obtém dados completos com timestamp
  async getData(): Promise<ESP32Data> {
    const response = await this.getTurbidityData();
    return {
      ...response.data,
      timestamp: new Date().toISOString(),
    };
  }

  // Registra callback para receber dados em tempo real
  onDataReceived(callback: (data: SensorData) => void): () => void {
    this.dataCallbacks.push(callback);

    // Retorna função para remover o callback
    return () => {
      this.dataCallbacks = this.dataCallbacks.filter((cb) => cb !== callback);
    };
  }

  // Registra callback para mudanças de status de conexão
  onStatusChange(
    callback: (status: BluetoothConnectionStatus) => void
  ): () => void {
    this.statusCallbacks.push(callback);

    // Retorna função para remover o callback
    return () => {
      this.statusCallbacks = this.statusCallbacks.filter(
        (cb) => cb !== callback
      );
    };
  }

  // Notifica mudanças de status
  private notifyStatusChange() {
    this.statusCallbacks.forEach((callback) =>
      callback({ ...this.connectionStatus })
    );
  }

  // Obtém status da conexão
  getConnectionStatus(): BluetoothConnectionStatus {
    return { ...this.connectionStatus };
  }

  // Métodos de utilidade para turbidez (mantidos para compatibilidade)
  getTurbidityLevel(turbidity: number): "low" | "medium" | "high" {
    if (turbidity <= 5) return "low";
    if (turbidity <= 25) return "medium";
    return "high";
  }

  getTurbidityStatus(turbidity: number): string {
    const level = this.getTurbidityLevel(turbidity);
    switch (level) {
      case "low":
        return "Ótima";
      case "medium":
        return "Boa";
      case "high":
        return "Ruim";
      default:
        return "Desconhecida";
    }
  }

  getTurbidityColor(turbidity: number): string {
    const level = this.getTurbidityLevel(turbidity);
    switch (level) {
      case "low":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "high":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  }
}

export const bluetoothService = new BluetoothService();
