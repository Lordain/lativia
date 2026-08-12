import Link from "next/link";

import StatusBadge from "@/components/orders/StatusBadge";

import type {
  OrderStatus,
} from "@/types/order";

import { formatBusinessDateTime } from "@/lib/time/formatBusinessDateTime";

interface RecentOrder {
  id: string;
  status: string;
  payment_status: string | null;
  amount: number | string | null;
  currency: string | null;
  created_at: string;

  services:
    | {
        title: string;
      }
    | null;

  profiles:
    | {
        name: string | null;
      }
    | null;
}

interface Props {
  orders: RecentOrder[];
}

export default function RecentOrdersList({
  orders,
}: Props) {
  return (
    <section className="h-full overflow-hidden rounded-xl border bg-white">
      {/* Header */}
      <div className="flex h-[86px] items-center justify-between border-b px-5">
        <div>
          <h2 className="font-semibold">
            最近订单
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            最近创建的 5 笔订单
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          查看全部
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="p-5 text-sm text-gray-500">
          暂无订单。
        </div>
      ) : (
        <div className="divide-y">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="
                flex
                min-h-[110px]
                items-center
                px-5
                py-4
                transition
                hover:bg-gray-50
              "
            >
              <div className="flex w-full items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-medium">
                      {order.services?.title ??
                        "未知服务"}
                    </p>

                    <StatusBadge
                      status={
                        order.status as OrderStatus
                      }
                    />
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    {order.profiles?.name ??
                      "未填写姓名"}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                  {formatBusinessDateTime(
                      order.created_at
                    )}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-medium">
                    {order.payment_status ===
                    "paid"
                      ? "已付款"
                      : "未付款"}
                  </p>

                  {order.amount !== null &&
                    order.amount !==
                      undefined &&
                    order.currency && (
                      <p className="mt-1 text-xs text-gray-500">
                        {order.currency ===
                        "CNY"
                          ? `¥${Number(
                              order.amount
                            ).toFixed(2)} CNY`
                          : `$${Number(
                              order.amount
                            ).toFixed(2)} ${order.currency}`}
                      </p>
                    )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}