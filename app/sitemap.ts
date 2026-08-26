import type {
    MetadataRoute,
  } from "next";

  import {
    getServices,
  } from "@/lib/services/getServices";

  import {
    guides,
  } from "@/lib/guides/guides";


  const SITE_URL =
    "https://lativiaglobal.com";

  export const revalidate =
    3600;

  export default async function sitemap():
    Promise<
      MetadataRoute.Sitemap
    > {
    const services =
      await getServices();


    const publicServices =
      services.filter(
        service =>
          service.isActive &&
          service.serviceStatus ===
            "active"
      );


    const staticPages:
      MetadataRoute.Sitemap = [
      {
        url:
          SITE_URL,

        changeFrequency:
          "weekly",

        priority:
          1,
      },

      {
        url:
          `${SITE_URL}/services`,

        changeFrequency:
          "weekly",

        priority:
          0.9,
      },

      {
        url:
          `${SITE_URL}/help`,

        changeFrequency:
          "monthly",

        priority:
          0.5,
      },

      {
        url:
          `${SITE_URL}/privacy`,

        changeFrequency:
          "yearly",

        priority:
          0.2,
      },

      {
        url:
          `${SITE_URL}/terms`,

        changeFrequency:
          "yearly",

        priority:
          0.2,
      },

      {
        url:
          `${SITE_URL}/refund-policy`,

        changeFrequency:
          "yearly",

        priority:
          0.2,
      },

      {
        url:
          `${SITE_URL}/data-processing`,

        changeFrequency:
          "yearly",

        priority:
          0.2,
      },
    ];


    const servicePages:
      MetadataRoute.Sitemap =
      publicServices.map(
        service => ({
          url:
            `${SITE_URL}/services/${service.slug}`,

          lastModified:
            service.updatedAt ??
            service.createdAt ??
            undefined,

          changeFrequency:
            "monthly",

          priority:
            service.popular
              ? 0.9
              : 0.8,
        })
      );

      const guidePages:
      MetadataRoute.Sitemap =
      guides.map(
        guide => ({
          url:
            `${SITE_URL}/guides/${guide.slug}`,

          lastModified:
            guide.updatedAt,

          changeFrequency:
            "monthly",

          priority:
            0.85,
        })
      );


      return [
        ...staticPages,

        {
          url:
            `${SITE_URL}/guides`,

          changeFrequency:
            "weekly",

          priority:
            0.9,
        },

        ...guidePages,
        ...servicePages,
      ];
  }