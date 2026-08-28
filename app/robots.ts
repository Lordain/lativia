import type {
  MetadataRoute,
} from "next";


export default function robots():
  MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent:
          "*",

        allow:
          "/",

        disallow: [
          "/account",
          "/admin",
          "/admin-login",
          "/auth",
          "/api",
        ],
      },
    ],

    sitemap:
      "https://lativiaglobal.com/sitemap.xml",

    host:
      "https://lativiaglobal.com",
  };
}