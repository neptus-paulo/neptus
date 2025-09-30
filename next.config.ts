import type { NextConfig } from "next";
// @ts-expect-error next-pwa doesn't have proper types
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  scope: "/",
  sw: "sw.js",
  // Configuração simplificada para permitir acesso offline ao login
  runtimeCaching: [
    {
      // Cache de recursos estáticos
      urlPattern: /\.(js|css|woff|woff2|png|jpg|jpeg|svg|ico)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "static-resources",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dias
        },
      },
    },
    {
      // Para páginas, permite offline mas com timeout rápido
      urlPattern: /^https?.*$/,
      handler: "NetworkFirst",
      options: {
        cacheName: "pages-cache",
        networkTimeoutSeconds: 2, // Timeout bem curto
        expiration: {
          maxEntries: 50,
        },
      },
    },
  ],
  disable: true, // Temporariamente desabilitado para corrigir problema offline
  publicExcludes: ["!robots.txt", "!sitemap.xml"],
});

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withPWA(nextConfig);
