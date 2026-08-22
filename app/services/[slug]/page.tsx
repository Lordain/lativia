import type {
  Metadata,
} from "next";

import {
  notFound,
} from "next/navigation";

import {
  getService,
} from "@/lib/services/getService";

import {
  getServicePrices,
} from "@/lib/services/getServicePrices";

import {
  brandConfig,
} from "@/lib/brand/brandConfig";

import {
  getCetesReferenceRates,
} from "@/lib/cetes/getCetesReferenceRates";

import PublicShell from "@/components/layout/PublicShell";

import RequirementList from "@/components/service/RequirementList";
import DynamicForm from "@/components/forms/DynamicForm";
import CetesLanding from "@/components/service/CetesLanding";

import ServiceHero from "@/components/service/ServiceHero";
import ServiceHelpCard from "@/components/service/ServiceHelpCard";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const {
    slug,
  } =
    await params;

  const service =
    await getService(
      slug
    );

  if (!service) {
    return {
      title:
        "找不到服务",
    };
  }

  return {
    title:
     `${service.title} | ${brandConfig.name}`,

    description:
      service.description,
  };
}

export default async function ServicePage({
  params,
}: Props) {
  const {
    slug,
  } =
    await params;

  const service =
    await getService(
      slug
    );

  if (!service) {
    notFound();
  }

  const prices =
    await getServicePrices(
      service.id
    );

  /*
   * =====================================
   * CETES Dedicated Landing
   * =====================================
   */

  if (
    service.slug ===
    "cetesdirecto-consultation"
  ) {
    const rates =
      await getCetesReferenceRates();

    return (
      <PublicShell>
        <CetesLanding
          service={
            service
          }

          prices={
            prices
          }

          rates={
            rates
          }
        />
      </PublicShell>
    );
  }

  /*
   * =====================================
   * Normal Service
   * =====================================
   */

  const isPaused =
    service
      .serviceStatus ===
    "paused";

    const priceSummaryMap =
    new Map<
      string,
      {
        label:
          string;

        amount:
          number;

        currency:
          string;

        sortOrder:
          number;
      }
    >();


  for (
    const price
    of prices
  ) {
    const option =
      price.serviceOption;


    if (
      !option ||
      !price.serviceOptionId ||
      !option.active
    ) {
      continue;
    }


    const existing =
      priceSummaryMap.get(
        option.id
      );


    if (
      !existing ||
      price.amount <
        existing.amount
    ) {
      priceSummaryMap.set(
        option.id,
        {
          label:
            option.title,

          amount:
            price.amount,

          currency:
            price.currency,

          sortOrder:
            option.sortOrder,
        }
      );
    }
  }


  const priceSummary =
    Array.from(
      priceSummaryMap.values()
    )
      .sort(
        (
          a,
          b
        ) =>
          a.sortOrder -
          b.sortOrder
      )
      .map(
        item => {
          const formatted =
            new Intl.NumberFormat(
              "zh-CN",
              {
                maximumFractionDigits:
                  2,
              }
            ).format(
              item.amount
            );

          const price =
            item.currency ===
              "MXN"
              ? `MXN $${formatted}`
              : item.currency ===
                  "CNY"
                ? `CNY ¥${formatted}`
                : `${item.currency} ${formatted}`;


          return {
            label:
              item.label,

            price,
          };
        }
      );

      const activeBasePrices =
  prices.filter(
    price =>
      price.active &&
      !price.serviceOptionId &&
      price.currency ===
        "MXN"
  );


const lowestBasePrice =
  activeBasePrices.length >
  0
    ? Math.min(
        ...activeBasePrices.map(
          price =>
            Number(
              price.amount
            )
        )
      )
    : null;


const basePrice =
  lowestBasePrice !==
  null
    ? `MX$${new Intl.NumberFormat(
        "es-MX",
        {
          maximumFractionDigits:
            0,
          minimumFractionDigits:
            0,
        }
      ).format(
        lowestBasePrice
      )}`
    : null;

      return (
        <PublicShell>
          <main className="bg-slate-50">
            <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">
              <ServiceHero
                slug={
                  service.slug
                }
                title={
                  service.title
                }
                description={
                  service.description
                }
                category={
                  service.category
                }
                duration={
                  service.duration
                }
                priceSummary={
                  priceSummary
                }
                basePrice={
                  basePrice
                }
                isPaused={
                  isPaused
                }
              />


              <RequirementList
                requirements={
                  service.requirements ??
                  []
                }
              />


              {isPaused ? (
                <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
                  <h2 className="text-lg font-bold text-amber-950">
                    此服务目前暂停受理
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-amber-800">
                    您仍可查看本服务说明和办理要求，
                    但目前暂时不能提交新的申请。
                  </p>
                </section>
              ) : (
                <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                  <div className="mb-6 border-b border-slate-100 pb-5">
                    <p className="text-sm font-bold text-blue-700">
                      在线办理
                    </p>

                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                      开始办理
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      填写办理资料，
                      选择适合的服务方案与付款方式。
                    </p>
                  </div>


                  <DynamicForm
                    serviceId={
                      service.id
                    }
                    schema={
                      service.formSchema
                    }
                    prices={
                      prices
                    }
                    eligibilityMode={
                      service
                        .eligibilityMode
                    }
                    eligibilitySchema={
                      service
                        .eligibilitySchema
                    }
                  />
                </section>
              )}


              <ServiceHelpCard />
            </div>
          </main>
        </PublicShell>
      );
}
