"use client";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import type {
  ReactNode,
} from "react";

import {
  brandConfig,
} from "@/lib/brand/brandConfig";


interface Props {
  children:
    ReactNode;

  adminLabel?:
    string;
}


const NAV_ITEMS = [
  {
    href:
      "/admin",

    label:
      "控制台",
  },

  {
    href:
      "/admin/operations",

    label:
      "运营待办",
  },

  {
    href:
      "/admin/orders",

    label:
      "订单管理",
  },

  {
    href:
      "/admin/appointments/availability",

    label:
      "预约时间管理",
  },

  {
    href:
      "/admin/notifications",

    label:
      "通知管理",
  },

  {
    href:
      "/admin/services",

    label:
      "服务管理",
  },

  {
    href:
      "/admin/payments/reconciliation",

    label:
      "支付对账",
  },
];


function isActivePath(
  pathname:
    string,

  href:
    string
) {
  if (
    href ===
    "/admin"
  ) {
    return (
      pathname ===
      "/admin"
    );
  }


  return (
    pathname ===
      href ||
    pathname.startsWith(
      `${href}/`
    )
  );
}


function NavIcon({
  index,
}: {
  index: number;
}) {
  const paths = [
    <>
      <rect
        key="1"
        x="4"
        y="4"
        width="6"
        height="6"
        rx="1"
      />

      <rect
        key="2"
        x="14"
        y="4"
        width="6"
        height="6"
        rx="1"
      />

      <rect
        key="3"
        x="4"
        y="14"
        width="6"
        height="6"
        rx="1"
      />

      <rect
        key="4"
        x="14"
        y="14"
        width="6"
        height="6"
        rx="1"
      />
    </>,

    <>
      <path
        key="1"
        d="M4 7h16"
      />

      <path
        key="2"
        d="M7 4v6"
      />

      <path
        key="3"
        d="M17 4v6"
      />

      <rect
        key="4"
        x="4"
        y="5"
        width="16"
        height="15"
        rx="2"
      />
    </>,

    <>
      <path
        key="1"
        d="M7 3h8l3 3v15H7z"
      />

      <path
        key="2"
        d="M10 10h5"
      />

      <path
        key="3"
        d="M10 14h5"
      />
    </>,

    <>
      <circle
        key="1"
        cx="12"
        cy="12"
        r="8"
      />

      <path
        key="2"
        d="M12 8v5l3 2"
      />
    </>,

    <>
      <path
        key="1"
        d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"
      />

      <path
        key="2"
        d="M10 21h4"
      />
    </>,

    <>
      <rect
        key="1"
        x="5"
        y="3"
        width="14"
        height="18"
        rx="2"
      />

      <path
        key="2"
        d="M9 8h6"
      />

      <path
        key="3"
        d="M9 12h6"
      />
    </>,

    <>
      <path
        key="1"
        d="M8 8h8"
      />

      <path
        key="2"
        d="M12 4v8"
      />

      <path
        key="3"
        d="M5 14c2 0 3 1 4 3 1-2 2-3 4-3s3 1 4 3"
      />
    </>,
  ];


  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[index]}
    </svg>
  );
}


export default function AdminLayoutShell({
  children,

  adminLabel =
    "admin",
}: Props) {
  const pathname =
    usePathname() ??
    "";


  const isConsultationPage =
    /^\/admin\/orders\/[^/]+\/consultation(?:\/.*)?$/.test(
      pathname
    );


  if (
    isConsultationPage
  ) {
    return (
      <div className="min-h-screen bg-slate-950">
        {children}
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <aside className="hidden w-[240px] shrink-0 border-r border-slate-200 bg-white lg:block">
          <div className="sticky top-0 flex h-screen flex-col">
            <div className="px-6 pb-6 pt-7">
              <Link
                href="/admin"
                className="block"
              >
                <p className="text-sm font-black tracking-wide text-blue-600">
                  {brandConfig.shortName}
                </p>

                <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-950">
                  管理后台
                </h1>
              </Link>
            </div>

            <div className="mx-4 border-t border-slate-100" />

            <nav className="flex-1 overflow-y-auto px-3 py-5">
              <div className="space-y-1">
                {NAV_ITEMS.map(
                  (
                    item,
                    index
                  ) => {
                    const active =
                      isActivePath(
                        pathname,
                        item.href
                      );

                    return (
                      <Link
                        key={
                          item.href
                        }
                        href={
                          item.href
                        }
                        className={`
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          px-3.5
                          py-2.5
                          text-sm
                          font-semibold
                          transition
                          ${
                            active
                              ? "bg-blue-50 text-blue-700"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                          }
                        `}
                      >
                        <span
                          className={
                            active
                              ? "text-blue-600"
                              : "text-slate-400"
                          }
                        >
                          <NavIcon
                            index={
                              index
                            }
                          />
                        </span>

                        {
                          item.label
                        }
                      </Link>
                    );
                  }
                )}
              </div>
            </nav>

            <div className="p-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  需要帮助？
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  查看帮助文档或联系技术支持
                </p>

                <Link
                  href="/help"
                  className="mt-3 flex items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
                >
                  帮助中心
                </Link>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex h-16 items-center justify-between px-5 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {
                    adminLabel
                      .slice(
                        0,
                        1
                      )
                      .toUpperCase()
                  }
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    后台管理
                  </p>

                  <p className="text-sm font-semibold text-slate-900">
                    {adminLabel}
                  </p>
                </div>
              </div>

              <Link
                href="/"
                className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-950"
              >
                返回网站
              </Link>
            </div>
          </header>

          <main className="min-w-0 flex-1">
            <div className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}