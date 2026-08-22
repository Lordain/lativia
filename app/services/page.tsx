import PublicShell from "@/components/layout/PublicShell";
import CategoryGrid from "@/components/home/CategoryGrid";
import {
  getHomepageServicePrices,
} from "@/lib/services/getHomepageServicePrices";

import {
  getServices,
} from "@/lib/services/getServices";


export default async function ServicesPage() {
  const [
    services,
    homepagePrices,
  ] =
    await Promise.all([
      getServices(),
      getHomepageServicePrices(),
    ]);


  return (
    <PublicShell>
      <main className="bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
            <p className="text-sm font-bold text-blue-700">
              办事服务
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              用中文找到您需要办理的服务
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              查看墨西哥常见办事、专业咨询与现场陪同服务，
              了解办理要求、流程、时间和费用。
            </p>
          </div>
        </section>

        <CategoryGrid
          services={
            services
          }
          prices={
            homepagePrices
          }
          variant="all"
        />
      </main>
    </PublicShell>
  );
}