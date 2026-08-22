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

  return (
    <PublicShell>
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