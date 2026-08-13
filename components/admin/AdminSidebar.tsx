"use client";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

const navigation = [
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
    href: string
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
      pathname === href ||
      pathname.startsWith(
        `${href}/`
      )
    );
  }

  return (
    <aside className="w-64 border-r bg-white">
      <div className="border-b px-6 py-5">
        <p className="text-lg font-bold">
          Mex Helper Admin
        </p>
      </div>

      <nav className="space-y-1 px-3 py-4">
        {navigation.map(
          (
            item
          ) => {
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
                  px-4
                  py-3
                  text-sm
                  font-medium
                  transition
                  ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
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
    </aside>
  );
}