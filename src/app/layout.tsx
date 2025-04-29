import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactQueryClientProvider } from "@/lib/react-query-provider";

const interSans = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neptus",
  description: "Monitoramento da qualidade da água em tanques de peixe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${interSans.className} antialiased`}>
        <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
      </body>
    </html>
  );
}
