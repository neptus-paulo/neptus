import { Bluetooth, Link2, Link2Off, Wifi } from "lucide-react";

import { useConnectionStore } from "@/stores/connectionStore";

import Box from "./Box";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

interface DeviceStatusProps {
  batteryLevel: number;
  isConnected: boolean;
  className?: string;
  deviceName?: string;
}

const DeviceStatus = ({
  batteryLevel,
  isConnected,
  className,
  deviceName,
}: DeviceStatusProps) => {
  const { connectionType } = useConnectionStore();

  const getConnectionIcon = () => {
    if (!isConnected) return <Link2Off />;
    return connectionType === "bluetooth" ? <Bluetooth /> : <Wifi />;
  };

  const getConnectionText = () => {
    if (!isConnected) return "Desconectado";
    if (connectionType === "bluetooth") {
      return deviceName ? `${deviceName} (BLE)` : "Bluetooth";
    }
    return "Wi-Fi";
  };

  return (
    <Box className={className}>
      <h3 className="font-semibold text-muted-foreground mb-4">
        Status do ESP32
      </h3>

      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm text-foreground/80">Bateria {batteryLevel}%</p>
          <Progress value={batteryLevel} className="h-2.5" />
        </div>

        <div className="space-y-1">
          <p className="text-sm text-foreground/80">Conexão</p>
          <Badge
            data-isconnected={isConnected ? "true" : "false"}
            className="rounded-full w-full h-6 data-[isconnected=true]:bg-success data-[isconnected=false]:bg-destructive"
          >
            {getConnectionIcon()}
            {getConnectionText()}
          </Badge>
        </div>

        {connectionType === "bluetooth" && (
          <div className="text-xs text-muted-foreground">
            <p>Via Bluetooth Low Energy</p>
            <p>Atualizações em tempo real</p>
          </div>
        )}
      </div>
    </Box>
  );
};

export default DeviceStatus;
