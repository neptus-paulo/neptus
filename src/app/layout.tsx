import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Providers from "@/auth/Providers";

const interSans = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neptus | Monitoramento da qualidade da água",
  description: "Monitoramento da qualidade da água em tanques de peixe.",
  metadataBase: new URL("https://neptus.vercel.app"),

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
        url: "/assets/site.webmanifest",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        url: "/assets/android-chrome-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        url: "/assets/android-chrome-512x512.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${interSans.className} antialiased max-w-[430px] mx-auto`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
