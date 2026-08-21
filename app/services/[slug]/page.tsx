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
  getCetesReferenceRates,
} from "@/lib/cetes/getCetesReferenceRates";

import ServiceInfo from "@/components/service/ServiceInfo";
import RequirementList from "@/components/service/RequirementList";
import ContactButton from "@/components/service/ContactButton";
import DynamicForm from "@/components/forms/DynamicForm";
import CetesLanding from "@/components/service/CetesLanding";

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
      `${service.title} | 墨西哥华人办事平台`,

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

  return (
    <main className="mx-auto max-w-4xl p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-3xl">
              {
                service.icon
              }
            </span>

            <h1 className="text-3xl font-bold md:text-4xl">
              {
                service.title
              }
            </h1>

            {isPaused && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                暂停受理
              </span>
            )}
          </div>

          <p className="mt-4 leading-7 text-gray-600">
            {
              service.description
            }
          </p>
        </div>
      </div>

      <ServiceInfo
          price={
            service.price
          }

          duration={
            service.duration
          }

          priceSummary={
            priceSummary
          }
        />

      <RequirementList
        requirements={
          service.requirements ??
          []
        }
      />

      {isPaused ? (
        <section className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-xl font-semibold text-amber-900">
            此服务目前暂停受理
          </h2>

          <p className="mt-2 text-sm leading-6 text-amber-800">
            您仍可查看本服务的说明和办理要求，
            但目前暂时不能提交新的申请。
          </p>
        </section>
      ) : (
        <section className="mt-10">
          <h2 className="mb-6 text-2xl font-bold">
            开始办理
          </h2>

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

      <ContactButton
        serviceName={
          service.title
        }
      />
    </main>
  );
}