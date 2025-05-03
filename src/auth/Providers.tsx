"use client";

import { SessionProvider } from "next-auth/react";

import { ReactQueryClientProvider } from "@/lib/react-query-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryClientProvider>
      <SessionProvider>{children}</SessionProvider>
    </ReactQueryClientProvider>
  );
}
