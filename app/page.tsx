import PublicShell from "@/components/layout/PublicShell";
import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";

import {
  getServices,
} from "@/lib/services/getServices";

import {
  getGovernmentBondRateSnapshot,
} from "@/lib/cetes/getGovernmentBondRateSnapshot";

import {
  getHomepageServicePrices,
} from "@/lib/services/getHomepageServicePrices";


const SITE_URL =
  "https://lativiaglobal.com";


export default async function Home() {
  const [
    services,
    rateSnapshot,
    homepagePrices,
  ] =
    await Promise.all([
      getServices(),
      getGovernmentBondRateSnapshot(),
      getHomepageServicePrices(),
    ]);


  const organizationJsonLd = {
    "@context":
      "https://schema.org",

    "@type":
      "Organization",

    "@id":
      `${SITE_URL}/#organization`,

    name:
      "Lativia",

    url:
      SITE_URL,

    description:
      "面向在墨西哥生活、工作和投资的中国用户，提供墨西哥官方手续的中文说明与办理协助。",
  };


  const websiteJsonLd = {
    "@context":
      "https://schema.org",

    "@type":
      "WebSite",

    "@id":
      `${SITE_URL}/#website`,

    url:
      SITE_URL,

    name:
      "Lativia",

    inLanguage:
      "zh-CN",

    publisher: {
      "@id":
        `${SITE_URL}/#organization`,
    },
  };


  return (
    <PublicShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              organizationJsonLd
            ).replace(
              /</g,
              "\\u003c"
            ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              websiteJsonLd
            ).replace(
              /</g,
              "\\u003c"
            ),
        }}
      />

      <Hero
        rateSnapshot={
          rateSnapshot
        }
      />

      <CategoryGrid
        services={
          services
        }
        prices={
          homepagePrices
        }
        variant="home"
      />
    </PublicShell>
  );
}
