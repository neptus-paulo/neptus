import { Link2, Link2Off } from "lucide-react";

import Box from "./Box";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

interface DeviceStatusProps {
  batteryLevel: number;
  isConnected: boolean;
  className?: string;
}

const DeviceStatus = ({
  batteryLevel,
  isConnected,
  className,
}: DeviceStatusProps) => {
  return (
    <Box className={className}>
      <h3 className="font-semibold text-muted-foreground mb-4">
        Status do Disp.
      </h3>

      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm text-foreground/80">Bateria {batteryLevel}%</p>
          <Progress value={batteryLevel} className="h-2.5" />
        </div>

        <div className="space-y-1">
          <p className="text-sm text-foreground/80">Status de conexão</p>
          <Badge
            data-isconnected={isConnected ? "true" : "false"}
            className="rounded-full w-full h-6 data-[isconnected=true]:bg-success data-[isconnected=false]:bg-destructive"
          >
            {isConnected ? <Link2 /> : <Link2Off />}

            {isConnected ? "Conectado" : "Desconectado"}
          </Badge>
        </div>
      </div>
    </Box>
  );
};

export default DeviceStatus;
