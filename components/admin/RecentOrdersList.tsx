import Link from "next/link";

import StatusBadge from "@/components/orders/StatusBadge";

import type {
  OrderStatus,
} from "@/types/order";

import {
  formatBusinessDateTime,
} from "@/lib/time/formatBusinessDateTime";


interface RecentOrder {
  id: string;

  status: string;

  payment_status:
    string | null;

  amount:
    number |
    string |
    null;

  currency:
    string | null;

  created_at:
    string;

  services:
    | {
        title:
          string;
      }
    | null;

  profiles:
    | {
        name:
          string | null;
      }
    | null;
}


interface Props {
  orders:
    RecentOrder[];
}


export default function RecentOrdersList({
  orders,
}: Props) {
  return (
    <section className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex min-h-[86px] items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="font-bold text-slate-950">
            最近订单
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            最近创建的 5 笔订单
          </p>
        </div>

        <Link
          href="/admin/orders"
          prefetch={false}
          className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        >
          查看全部 →
        </Link>
      </div>

      {orders.length ===
      0 ? (
        <div className="px-5 py-10 text-center text-sm text-slate-500">
          暂无订单。
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {orders.map(
            order => (
              <Link
                key={
                  order.id
                }
                href={`/admin/orders/${order.id}`}
                prefetch={false}
                className="group flex min-h-[110px] items-center px-5 py-4 transition hover:bg-slate-50"
              >
                <div className="flex w-full items-center justify-between gap-5">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-semibold text-slate-900">
                        {
                          order.services
                            ?.title ??
                          "未知服务"
                        }
                      </p>

                      <StatusBadge
                        status={
                          order.status as
                            OrderStatus
                        }
                      />
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {
                        order.profiles
                          ?.name ??
                        "未填写姓名"
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {
                        formatBusinessDateTime(
                          order.created_at
                        )
                      }
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p
                      className={`
                        text-sm
                        font-semibold
                        ${
                          order.payment_status ===
                          "paid"
                            ? "text-emerald-700"
                            : "text-amber-700"
                        }
                      `}
                    >
                      {order.payment_status ===
                      "paid"
                        ? "已付款"
                        : "未付款"}
                    </p>

                    {order.amount !==
                      null &&
                      order.amount !==
                        undefined &&
                      order.currency && (
                      <p className="mt-1 text-xs text-slate-500">
                        {order.currency ===
                        "CNY"
                          ? `¥${Number(
                              order.amount
                            ).toFixed(
                              2
                            )} CNY`
                          : `$${Number(
                              order.amount
                            ).toFixed(
                              2
                            )} ${order.currency}`}
                      </p>
                    )}

                    <p className="mt-2 text-xs font-semibold text-blue-600 opacity-0 transition group-hover:opacity-100">
                      查看 →
                    </p>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      )}
    </section>
  );
}