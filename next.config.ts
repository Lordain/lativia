import type {
  NextConfig,
} from "next";

const nextConfig:
  NextConfig = {
    allowedDevOrigins: [
      "tend-including-checkout-lists.trycloudflare.com",
    ],

    experimental: {
      serverActions: {
        bodySizeLimit:
          "50mb",
      },
    },
  };

export default nextConfig;