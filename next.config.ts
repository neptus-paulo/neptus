import type { NextConfig } from "next";
// @ts-expect-error next-pwa doesn't have proper types
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withPWA(nextConfig);
