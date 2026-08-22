"use client";

import Link from "next/link";

import {
  useMemo,
  useState,
} from "react";

import SearchBar from "@/components/home/SearchBar";

import {
  CETES_CONSULTATION_ORIGINAL_AMOUNT,
} from "@/lib/cetes/cetesConsultationPricing";

import type {
  Service,
} from "@/types/service";

import type {
  HomepageServicePriceSummary,
} from "@/types/homepageServicePrice";


interface CategoryGridProps {
  services:
    Service[];

  prices:
    HomepageServicePriceSummary[];

  variant?:
    "home" |
    "all";
}


type ServiceIconName =
  | "bond"
  | "id"
  | "tax"
  | "signature"
  | "building"
  | "document";


const CORE_SERVICE_SLUG =
  "cetesdirecto-consultation";


const PRIORITY_SERVICE_SLUGS = [
  CORE_SERVICE_SLUG,

  "individual-rfc-first-registration",

  "individual-efirma-first-registration",

  "individual-rfc-efirma-onsite",

  "company-rfc-first-registration",

  "company-efirma-first-registration",

  "company-rfc-efirma-onsite",
] as const;


const HOT_SERVICE_SLUGS =
  new Set(
    PRIORITY_SERVICE_SLUGS.slice(
      1
    )
  );


function getPriority(
  service:
    Service
) {
  const index =
    PRIORITY_SERVICE_SLUGS.indexOf(
      service.slug as
        typeof PRIORITY_SERVICE_SLUGS[number]
    );

  return index ===
    -1
    ? 999
    : index;
}


function isTestService(
  service:
    Service
) {
  const text =
    `${service.slug} ${service.title}`
      .toLowerCase();

  return (
    text.includes(
      "test"
    ) ||
    text.includes(
      "e2e"
    )
  );
}


function getDisplayTitle(
  title:
    string
) {
  return title.replaceAll(
    "公司",
    "企业"
  );
}


function getCategoryLabel(
  category:
    string
) {
  const normalized =
    category
      .trim()
      .toLowerCase();


  const labels:
    Record<
      string,
      string
    > = {
      tax:
        "税务服务",

      identity:
        "身份服务",

      consultation:
        "专业咨询",

      immigration:
        "移民服务",

      business:
        "企业服务",
    };


  return (
    labels[
      normalized
    ] ??
    category ??
    "办理服务"
  );
}


function getServiceIcon(
  service:
    Service
):
  ServiceIconName {
  const text =
    `${service.slug} ${service.title} ${service.category}`
      .toLowerCase();


  if (
    text.includes(
      "cetes"
    ) ||
    text.includes(
      "国债"
    )
  ) {
    return "bond";
  }


  if (
    text.includes(
      "curp"
    ) ||
    text.includes(
      "身份"
    )
  ) {
    return "id";
  }


  if (
    text.includes(
      "rfc"
    ) &&
    text.includes(
      "efirma"
    )
  ) {
    return "document";
  }


  if (
    text.includes(
      "e.firma"
    ) ||
    text.includes(
      "efirma"
    ) ||
    text.includes(
      "电子签"
    )
  ) {
    return "signature";
  }


  if (
    text.includes(
      "company"
    ) ||
    text.includes(
      "公司"
    ) ||
    text.includes(
      "企业"
    )
  ) {
    return "building";
  }


  if (
    text.includes(
      "rfc"
    ) ||
    text.includes(
      "税"
    )
  ) {
    return "tax";
  }


  return "document";
}


function ServiceIcon({
  name,
}: {
  name:
    ServiceIconName;
}) {
  const common = {
    fill:
      "none",

    stroke:
      "currentColor",

    strokeWidth:
      1.8,

    strokeLinecap:
      "round" as const,

    strokeLinejoin:
      "round" as const,
  };


  switch (
    name
  ) {
    case "bond":
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          {...common}
        >
          <path d="M4 18V9" />
          <path d="M9 18V5" />
          <path d="M14 18v-7" />
          <path d="M19 18V3" />
          <path d="M3 21h18" />
          <path d="m4 7 5-4 5 5 5-6" />
        </svg>
      );


    case "id":
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          {...common}
        >
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
          />

          <circle
            cx="8"
            cy="11"
            r="2"
          />

          <path d="M5.5 16c.7-1.8 1.6-2.5 2.5-2.5s1.8.7 2.5 2.5" />

          <path d="M13 10h5" />
          <path d="M13 14h5" />
        </svg>
      );


    case "signature":
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          {...common}
        >
          <path d="m4 18 3.5-.8L18 6.7 14.3 3 3.8 13.5 3 17z" />
          <path d="m12.8 4.5 3.7 3.7" />
          <path d="M10 20h10" />
        </svg>
      );


    case "building":
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          {...common}
        >
          <path d="M4 21V7l8-4 8 4v14" />
          <path d="M8 10h2" />
          <path d="M14 10h2" />
          <path d="M8 14h2" />
          <path d="M14 14h2" />
          <path d="M10 21v-4h4v4" />
        </svg>
      );


    case "tax":
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          {...common}
        >
          <path d="M6 3h9l3 3v15H6z" />
          <path d="M15 3v4h4" />
          <path d="M9 11h6" />
          <path d="M9 15h3" />
          <path d="M16 14v4" />
          <path d="M14 16h4" />
        </svg>
      );


    default:
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          {...common}
        >
          <path d="M6 3h9l3 3v15H6z" />
          <path d="M15 3v4h4" />
          <path d="M9 12h6" />
          <path d="M9 16h6" />
        </svg>
      );
  }
}


function formatPrice(
  amount:
    number,
  currency:
    string
) {
  const formatted =
    new Intl.NumberFormat(
      "es-MX",
      {
        maximumFractionDigits:
          0,

        minimumFractionDigits:
          0,
      }
    ).format(
      amount
    );


  if (
    currency ===
    "MXN"
  ) {
    return `MX$${formatted}`;
  }


  return `${currency} ${formatted}`;
}


function getOptionLabel(
  optionKey:
    string | null,
  optionTitle:
    string | null
) {
  if (
    optionKey ===
    "appointment_only"
  ) {
    return "预约协助";
  }


  if (
    optionKey ===
    "appointment_plus_onsite"
  ) {
    return optionTitle
      ?.replace(
        "预约 + ",
        "预约 + "
      ) ??
      "预约 + 现场办理陪同";
  }


  return (
    optionTitle ??
    "服务费用"
  );
}


function ServicePriceBlock({
  service,
  priceSummary,
}: {
  service:
    Service;

  priceSummary:
    HomepageServicePriceSummary |
    null;
}) {
  if (
    service.slug ===
    CORE_SERVICE_SLUG
  ) {
    const current =
      priceSummary
        ?.options[0] ??
      null;


    return (
      <div className="mt-auto border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs leading-5 text-slate-500">
            当前优惠价
          </span>

          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-slate-400 line-through decoration-2">
              {formatPrice(
                CETES_CONSULTATION_ORIGINAL_AMOUNT,
                "MXN"
              )}
            </span>

            <span className="text-base font-bold text-slate-950">
              {current
                ? formatPrice(
                    current.amount,
                    current.currency
                  )
                : "价格待更新"}
            </span>
          </div>
        </div>
      </div>
    );
  }


  if (
    !priceSummary
      ?.options.length
  ) {
    return null;
  }


  return (
    <div className="mt-auto space-y-2.5 border-t border-slate-100 pt-4">
      {priceSummary.options.map(
        (
          option,
          index
        ) => (
          <div
            key={
              `${option.optionKey ?? "base"}-${index}`
            }
            className="flex items-center justify-between gap-4"
          >
            <span className="text-xs leading-5 text-slate-500">
              {getOptionLabel(
                option.optionKey,
                option.optionTitle
              )}
            </span>

            <span className="shrink-0 text-base font-bold text-slate-950">
              {formatPrice(
                option.amount,
                option.currency
              )}
            </span>
          </div>
        )
      )}
    </div>
  );
}


function ServiceCard({
  service,
  priceSummary,
}: {
  service:
    Service;

  priceSummary:
    HomepageServicePriceSummary |
    null;
}) {
  const core =
    service.slug ===
    CORE_SERVICE_SLUG;


  const hot =
    HOT_SERVICE_SLUGS.has(
      service.slug as
        typeof PRIORITY_SERVICE_SLUGS[number]
    );


  return (
    <Link
      href={
        `/services/${service.slug}`
      }
      className={
        core
          ? "group flex min-h-[280px] flex-col rounded-2xl border border-cyan-200 bg-white p-6 shadow-sm ring-1 ring-cyan-100 transition duration-200 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-100/50"
          : "group flex min-h-[280px] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/70"
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={
            core
              ? "flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700"
              : "flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700"
          }
        >
          <ServiceIcon
            name={
              getServiceIcon(
                service
              )
            }
          />
        </div>


        <span className="text-lg text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600">
          →
        </span>
      </div>


      <div className="mt-5">
        <div className="flex flex-wrap items-center gap-2">
          {core && (
            <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[11px] font-bold text-cyan-700">
              核心服务
            </span>
          )}

          {hot && (
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
              热门服务
            </span>
          )}

          <span className="text-xs font-bold text-slate-500">
            {getCategoryLabel(
              service.category
            )}
          </span>
        </div>


        <h3 className="mt-3 text-lg font-bold leading-7 text-slate-950">
          {getDisplayTitle(
            service.title
          )}
        </h3>


        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
          {
            service.shortDescription
          }
        </p>
      </div>


      <ServicePriceBlock
        service={
          service
        }
        priceSummary={
          priceSummary
        }
      />
    </Link>
  );
}


export default function CategoryGrid({
  services,
  prices,
  variant =
    "home",
}: CategoryGridProps) {
  const [
    keyword,
    setKeyword,
  ] =
    useState(
      ""
    );


  const priceMap =
    useMemo(
      () =>
        new Map(
          prices.map(
            item => [
              item.serviceId,
              item,
            ]
          )
        ),
      [
        prices,
      ]
    );


  const cleanServices =
    useMemo(
      () =>
        services.filter(
          service =>
            !isTestService(
              service
            )
        ),
      [
        services,
      ]
    );


  const orderedServices =
    useMemo(
      () =>
        [
          ...cleanServices,
        ].sort(
          (
            a,
            b
          ) => {
            const priorityDifference =
              getPriority(
                a
              ) -
              getPriority(
                b
              );


            if (
              priorityDifference !==
              0
            ) {
              return priorityDifference;
            }


            if (
              a.popular !==
              b.popular
            ) {
              return a.popular
                ? -1
                : 1;
            }


            return getDisplayTitle(
              a.title
            ).localeCompare(
              getDisplayTitle(
                b.title
              ),
              "zh-CN"
            );
          }
        ),
      [
        cleanServices,
      ]
    );


  const searchText =
    keyword
      .trim()
      .toLowerCase();


  const displayedServices =
    searchText
      ? orderedServices.filter(
          service =>
            [
              service.title,
              getDisplayTitle(
                service.title
              ),
              service.shortDescription,
              service.description,
              service.category,
            ]
              .join(
                " "
              )
              .toLowerCase()
              .includes(
                searchText
              )
        )
      : variant ===
          "home"
        ? orderedServices.slice(
            0,
            9
          )
        : orderedServices;


  return (
    <section className="bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold text-blue-700">
              {variant ===
              "home"
                ? "热门办理服务"
                : "全部办理服务"}
            </p>

            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              找到适合您的办理与咨询服务
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              从墨西哥国债咨询到常见身份、
              税务与电子签办理，
              用中文了解要求、流程和下一步。
            </p>
          </div>


          {variant ===
            "home" && (
            <Link
              href="/services"
              className="inline-flex min-h-11 shrink-0 items-center font-bold text-blue-700 transition hover:text-blue-800"
            >
              查看全部服务

              <span className="ml-2">
                →
              </span>
            </Link>
          )}
        </div>


        <div className="mt-9 mb-8">
          <SearchBar
            keyword={
              keyword
            }
            onChange={
              setKeyword
            }
          />
        </div>


        {searchText && (
          <p className="mb-5 text-sm font-semibold text-slate-600">
            搜索结果 ·{" "}
            {
              displayedServices.length
            }
          </p>
        )}


        {displayedServices.length >
        0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {displayedServices.map(
              service => (
                <ServiceCard
                  key={
                    service.id
                  }
                  service={
                    service
                  }
                  priceSummary={
                    priceMap.get(
                      service.id
                    ) ??
                    null
                  }
                />
              )
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
            <p className="font-semibold text-slate-900">
              暂时没有找到相关服务
            </p>

            <p className="mt-2 text-sm text-slate-500">
              可以尝试搜索 RFC、CURP、
              e.firma 或国债。
            </p>
          </div>
        )}
      </div>
    </section>
  );
}