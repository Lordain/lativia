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


const securityHeaders = [
  {
    key:
      "Strict-Transport-Security",

    value:
      "max-age=31536000; includeSubDomains",
  },

  {
    key:
      "X-Content-Type-Options",

    value:
      "nosniff",
  },

  {
    key:
      "X-Frame-Options",

    value:
      "DENY",
  },

  {
    key:
      "Referrer-Policy",

    value:
      "strict-origin-when-cross-origin",
  },

  {
    key:
      "Permissions-Policy",

    value:
      "camera=(), microphone=(), geolocation=()",
  },
];


const nextConfig:
  NextConfig = {
    allowedDevOrigins,

    experimental: {
      serverActions: {
        bodySizeLimit:
          "50mb",
      },
    },

    async headers() {
      return [
        {
          source:
            "/(.*)",

          headers:
            securityHeaders,
        },
      ];
    },
  };


export default nextConfig;