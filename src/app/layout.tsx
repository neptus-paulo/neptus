import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Providers from "@/auth/Providers";
import DataSyncManager from "@/components/DataSyncManager";
import OfflineIndicator from "@/components/OfflineIndicator";

const interSans = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neptus",
  description: "Monitoramento da qualidade da água em tanques de peixe.",
  metadataBase: new URL("https://neptus.vercel.app"),

  applicationName: "Neptus",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Neptus",
  },
  formatDetection: {
    telephone: false,
  },

  openGraph: {
    title: "Neptus",
    description: "Monitoramento da qualidade da água em tanques de peixe.",
    images: [
      {
        url: "/assets/icon-1024x1024.png",
        width: 1024,
        height: 1024,
        alt: "Neptus - Monitoramento de qualidade da água",
      },
    ],
    type: "website",
  },

  icons: {
    icon: [
      { url: "/assets/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/assets/apple-touch-icon.png",
    other: [
      {
        rel: "manifest",
        url: "/manifest.json",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },

  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head>
        <meta name="application-name" content="Neptus" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Neptus" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta
          name="msapplication-TileColor"
          content="oklch(0.983 0.0225 247.912)"
        />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="oklch(0.983 0.0225 247.912)" />
      </head>
      <body
        className={`${interSans.className} antialiased max-w-[430px] mx-auto`}
      >
        <Providers>
          <OfflineIndicator />
          <DataSyncManager />
          {children}
        </Providers>
      </body>
    </html>
  );
}
