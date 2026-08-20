"use client";

import Link from "next/link";
import {
  usePathname,
} from "next/navigation";

import type {
  ReactNode,
} from "react";


interface Props {
  children: ReactNode;
  adminLabel?: string;
}


const NAV_ITEMS = [
  {
    href: "/admin",
    label: "控制台",
  },
  {
    href: "/admin/operations",
    label: "运营待办",
  },
  {
    href: "/admin/orders",
    label: "订单管理",
  },
  {
    href: "/admin/notifications",
    label: "通知管理",
  },
  {
    href: "/admin/services",
    label: "服务管理",
  },
  {
    href: "/admin/payments",
    label: "支付对账",
  },
];


function isActivePath(
  pathname: string,
  href: string
) {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}


export default function AdminLayoutShell({
  children,
  adminLabel = "admin",
}: Props) {
  const pathname =
    usePathname() ?? "";


  const isConsultationPage =
    /^\/admin\/orders\/[^/]+\/consultation(?:\/.*)?$/.test(
      pathname
    );


  /*
   * =========================================
   * Fullscreen Consultation Mode
   * =========================================
   */
  if (isConsultationPage) {
    return (
      <div className="min-h-screen bg-slate-950">
        {children}
      </div>
    );
  }


  /*
   * =========================================
   * Normal Admin Layout
   * =========================================
   */
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r bg-white lg:block">
          <div className="flex h-full flex-col">
            <div className="border-b px-6 py-8">
              <Link
                href="/admin"
                className="block"
              >
                <p className="text-sm font-bold tracking-wide text-blue-600">
                  MEX HELPER
                </p>

                <h1 className="mt-2 text-3xl font-bold leading-tight text-gray-900">
                  管理后台
                </h1>
              </Link>
            </div>

            <nav className="flex-1 px-4 py-6">
              <div className="space-y-2">
                {NAV_ITEMS.map(item => {
                  const active =
                    isActivePath(
                      pathname,
                      item.href
                    );

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        block rounded-xl px-4 py-3 text-sm font-medium transition
                        ${
                          active
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }
                      `}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b bg-white">
            <div className="flex items-center justify-between px-6 py-6">
              <div>
                <p className="text-sm text-gray-500">
                  后台管理
                </p>

                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {adminLabel}
                </p>
              </div>

              <Link
                href="/"
                className="rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                返回网站
              </Link>
            </div>
          </header>

          <main className="min-w-0 flex-1 p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}