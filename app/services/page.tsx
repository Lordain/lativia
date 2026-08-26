import type {
  Metadata,
} from "next";

import PublicShell from "@/components/layout/PublicShell";
import CategoryGrid from "@/components/home/CategoryGrid";
import {
  getHomepageServicePrices,
} from "@/lib/services/getHomepageServicePrices";

import {
  getServices,
} from "@/lib/services/getServices";

export const metadata:
  Metadata = {
    title:
      "墨西哥华人办事服务｜RFC、e.firma、SAT、INM 中文协助",

    description:
      "为中国用户整理墨西哥常见官方手续与中文办理协助，包括 RFC、e.firma、SAT、INM、Cetesdirecto 等服务，查看资料要求、流程、时间和费用。",

    alternates: {
      canonical:
        "/services",
    },

    openGraph: {
      type:
        "website",

      url:
        "/services",

      title:
        "墨西哥华人办事服务｜Lativia",

      description:
        "面向中国用户的墨西哥 RFC、e.firma、SAT、INM、Cetesdirecto 中文说明与办理协助。",
    },
  };




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