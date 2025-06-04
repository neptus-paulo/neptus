"use client";

import { WifiOff } from "lucide-react";

import { useOnlineStatus } from "@/hooks/useOnlineStatus";

const OfflineIndicator = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white p-2 text-center text-sm">
      <div className="flex items-center justify-center gap-2 max-w-[430px] mx-auto">
        <WifiOff size={16} />
        <span>Você está offline. Alguns recursos podem não funcionar.</span>
      </div>
    </div>
  );
};

export default OfflineIndicator;
