import type {
  NextConfig,
} from "next";


const allowedDevOrigins =
  process.env
    .DEV_ALLOWED_ORIGIN
    ? [
        process.env
          .DEV_ALLOWED_ORIGIN,
      ]
    : [];


const nextConfig:
  NextConfig = {
    allowedDevOrigins,

    experimental: {
      serverActions: {
        bodySizeLimit:
          "50mb",
      },
    },
  };


export default nextConfig;