import Link from "next/link";

import PublicShell from "@/components/layout/PublicShell";
import StatusBadge from "@/components/orders/StatusBadge";

import {
  getMyOrders,
} from "@/lib/orders/getMyOrders";


export default async function MyOrdersPage() {
  const orders =
    await getMyOrders();

  return (
    <PublicShell>
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 md:py-10 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-700">
            Account
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            我的订单
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            查看您已经购买的服务、当前办理状态以及需要处理的事项。
          </p>
        </div>


        {orders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <p className="text-slate-500">
              目前还没有订单记录。
            </p>

            <Link
              href="/services"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              查看服务
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(
              (order) => (
                <Link
                  href={`/account/orders/${order.id}`}
                  key={order.id}
                  className="block rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="font-semibold text-slate-950">
                        {order.services?.title ??
                          "服务"}
                      </h2>

                      <p className="mt-2 text-sm text-slate-500">
                        创建时间：
                        {new Date(
                          order.created_at
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <StatusBadge
                        status={
                          order.status
                        }
                      />
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        )}
      </main>
    </PublicShell>
  );
}