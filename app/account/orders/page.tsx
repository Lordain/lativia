import Link from "next/link";

import PublicShell from "@/components/layout/PublicShell";
import StatusBadge from "@/components/orders/StatusBadge";

import {
  getMyOrders,
} from "@/lib/orders/getMyOrders";


function formatOrderDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "zh-CN",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  ).format(
    new Date(value)
  );
}


export default async function MyOrdersPage() {
  const orders =
    await getMyOrders();

  return (
    <PublicShell>
      <main className="min-h-[60vh] bg-slate-50">
        <div className="mx-auto w-full max-w-4xl px-4 py-7 sm:px-6 md:py-9">
          {/* Header */}
          <div className="mb-6">
            <p className="text-xs font-bold tracking-wide text-blue-700">
              ACCOUNT
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
              我的订单
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              查看已购买的服务和当前办理状态。
            </p>
          </div>


          {orders.length ===
          0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-8 text-center shadow-sm">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 3h12a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2Z" />
                  <path d="M8 8h8" />
                  <path d="M8 12h6" />
                </svg>
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-900">
                目前还没有订单
              </p>

              <p className="mt-1 text-sm text-slate-500">
                购买服务后，订单会显示在这里。
              </p>

              <Link
                href="/services"
                className="mt-5 inline-flex min-h-10 items-center justify-center rounded-xl bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                查看服务
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {orders.map(
                (
                  order,
                  index
                ) => {
                  const canContinuePayment =
                    order.payment_status ===
                      "unpaid" ||
                    order.payment_status ===
                      "failed";

                  const paymentActionLabel =
                    order.payment_status ===
                    "failed"
                      ? "重新付款"
                      : "继续付款";

                  return (
                    <div
                      key={
                        order.id
                      }
                      className={[
                        "px-4 py-4 sm:px-5",
                        index <
                        orders.length -
                          1
                          ? "border-b border-slate-100"
                          : "",
                      ].join(
                        " "
                      )}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="group min-w-0 flex-1"
                        >
                          <h2 className="truncate text-sm font-semibold text-slate-950 transition group-hover:text-blue-700 sm:text-[15px]">
                            {(
                              order
                                .services
                                ?.title ??
                              "服务"
                            ).replaceAll(
                              "公司",
                              "企业"
                            )}
                          </h2>

                          <p className="mt-1.5 text-xs text-slate-500">
                            {formatOrderDate(
                              order.created_at
                            )}
                          </p>
                        </Link>


                        <div className="flex shrink-0 items-center gap-3">
                          {order.payment_status ===
                          "unpaid" ? (
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                              等待付款
                            </span>
                          ) : order.payment_status ===
                          "failed" ? (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                              付款未完成
                            </span>
                          ) : (
                            <StatusBadge
                              status={
                                order.status
                              }
                            />
                          )}


                          {canContinuePayment && (
                            <Link
                              href={`/account/orders/${order.id}/payment`}
                              className="inline-flex min-h-9 items-center justify-center rounded-lg bg-blue-700 px-3 text-xs font-semibold text-white transition hover:bg-blue-800"
                            >
                              {
                                paymentActionLabel
                              }
                            </Link>
                          )}


                          <Link
                            href={`/account/orders/${order.id}`}
                            aria-label="查看订单详情"
                            className="hidden text-slate-300 transition hover:translate-x-0.5 hover:text-blue-600 sm:block"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </main>
    </PublicShell>
  );
}