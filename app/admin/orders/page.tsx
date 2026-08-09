import Link from "next/link";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getAdminOrders } from "@/lib/orders/getAdminOrders";
import StatusBadge from "@/components/orders/StatusBadge";
import type { OrderStatus } from "@/types/order";

export default async function AdminOrdersPage() {
  await requireAdmin();

  const orders = await getAdminOrders();

  return (
    <main className="mx-auto max-w-6xl p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          接单管理
        </h1>

        <p className="mt-2 text-gray-500">
          查看和管理所有客户提交的服务申请。
        </p>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500">
          目前没有服务单。
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="block rounded-lg border p-5 transition hover:bg-gray-50"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    {order.services?.title ?? "未知服务"}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    客户：
                    {order.profiles?.name ?? "未知用户"}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    提交时间：
                    {new Date(
                      order.created_at
                    ).toLocaleString()}
                  </p>
                </div>

                <StatusBadge
                  status={order.status as OrderStatus}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}