"use client";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";


const navigationItems = [
  {
    label:
      "控制台",

    href:
      "/admin",
  },

  {
    label:
      "运营待办",

    href:
      "/admin/operations",
  },

  {
    label:
      "订单管理",

    href:
      "/admin/orders",
  },

  {
    label:
      "通知管理",

    href:
      "/admin/notifications",
  },

  {
    label:
      "服务管理",

    href:
      "/admin/services",
  },

  {
    label:
      "支付对账",

    href:
      "/admin/payments/reconciliation",
  },
];


export default function AdminSidebar() {
  const pathname =
    usePathname();


  function isActive(
    href:
      string
  ) {
    /*
     * /admin 只在 Dashboard 首页高亮。
     *
     * 其他项目：
     *
     * /admin/orders
     * /admin/orders/[id]
     *
     * 都应该保持「订单管理」高亮。
     */

    if (
      href ===
      "/admin"
    ) {
      return pathname ===
        "/admin";
    }


    return (
      pathname ===
        href ||
      pathname.startsWith(
        `${href}/`
      )
    );
  }


  return (
    <aside
      className="
        w-64
        shrink-0
        border-r
        bg-white
      "
    >
      <div className="sticky top-0 p-5">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            MEX Helper
          </p>

          <p className="mt-1 text-lg font-semibold">
            管理后台
          </p>
        </div>


        <nav className="space-y-1">
          {navigationItems.map(
            item => {
              const active =
                isActive(
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
                    block
                    rounded-lg
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    transition
                    ${
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  {
                    item.label
                  }
                </Link>
              );
            }
          )}
        </nav>
      </div>
    </aside>
  );
}