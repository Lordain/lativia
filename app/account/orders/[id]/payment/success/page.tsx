import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import PublicShell from "@/components/layout/PublicShell";
import PaymentBadge from "@/components/orders/PaymentBadge";

import {
  getMyOrder,
} from "@/lib/orders/getMyOrder";

import {
  getPaymentProviderLabel,
} from "@/lib/payments/paymentLabel";

import type {
  PaymentProvider,
  PaymentStatus,
} from "@/types/payment";


interface Props {
  params:
    Promise<{
      id: string;
    }>;
}


function formatAmount(
  amount:
    number | string | null,
  currency:
    string | null
) {
  const numericAmount =
    Number(
      amount ??
      0
    );

  if (
    currency ===
    "CNY"
  ) {
    return new Intl.NumberFormat(
      "zh-CN",
      {
        style:
          "currency",
        currency:
          "CNY",
        minimumFractionDigits:
          2,
      }
    ).format(
      numericAmount
    );
  }


  return new Intl.NumberFormat(
    "es-MX",
    {
      style:
        "currency",
      currency:
        "MXN",
      minimumFractionDigits:
        2,
    }
  ).format(
    numericAmount
  );
}


export default async function PaymentSuccessPage({
  params,
}: Props) {
  const {
    id,
  } =
    await params;

  const order =
    await getMyOrder(
      id
    );


  if (
    !order
  ) {
    notFound();
  }


  const isPaid =
    order.payment_status ===
    "paid";

  const isFailed =
    order.payment_status ===
    "failed";

  const isRefunded =
    order.payment_status ===
    "refunded";

  const isConfirming =
    order.payment_status ===
    "unpaid";

  const amountLabel =
    formatAmount(
      order.amount,
      order.currency
    );

  const providerLabel =
    getPaymentProviderLabel(
      order
        .payment_provider as
        PaymentProvider
    );


  return (
    <PublicShell>
      <main className="min-h-[70vh] bg-slate-50">
        <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 md:py-12">
          <div className="mx-auto max-w-xl">
            <div className="text-center">
              <div
                className={[
                  "mx-auto flex h-14 w-14 items-center justify-center rounded-full",
                  isPaid
                    ? "bg-emerald-100 text-emerald-700"
                    : isFailed
                      ? "bg-red-100 text-red-700"
                      : isRefunded
                        ? "bg-slate-200 text-slate-600"
                        : "bg-blue-100 text-blue-700",
                ].join(
                  " "
                )}
              >
                {isPaid ? (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                ) : isFailed ? (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M8 8l8 8" />
                    <path d="m16 8-8 8" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    className={[
                      "h-6 w-6",
                      isConfirming
                        ? "animate-spin"
                        : "",
                    ].join(
                      " "
                    )}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M21 12a9 9 0 1 1-6.22-8.56" />
                  </svg>
                )}
              </div>


              <p className="mt-5 text-xs font-bold tracking-[0.12em] text-blue-700">
                PAYMENT
              </p>


              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                {isPaid
                  ? "付款已完成"
                  : isFailed
                    ? "付款未完成"
                    : isRefunded
                      ? "订单已退款"
                      : "正在确认付款"}
              </h1>


              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {isPaid
                  ? "我们已经确认收到您的付款，订单将进入后续服务处理流程。"
                  : isFailed
                    ? "支付平台尚未确认本次付款，您可以返回订单重新付款。"
                    : isRefunded
                      ? "此订单已经完成退款，不需要再次付款。"
                      : "支付平台已经返回，系统正在确认最终付款结果。请以订单付款状态为准。"}
              </p>
            </div>


            <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <p className="text-xs font-medium text-slate-400">
                  订单服务
                </p>

                <h2 className="mt-1 text-base font-bold leading-6 text-slate-950">
                  {(
                    order.services
                      ?.title ??
                    "服务订单"
                  ).replaceAll(
                    "公司",
                    "企业"
                  )}
                </h2>
              </div>


              <div className="px-5 py-5 sm:px-6">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      订单金额
                    </p>

                    <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                      {
                        amountLabel
                      }
                    </p>
                  </div>

                  <PaymentBadge
                    status={
                      order.payment_status as
                        PaymentStatus
                    }
                  />
                </div>


                <div className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-slate-50/60">
                  <div className="flex items-center justify-between gap-4 px-4 py-3">
                    <span className="text-sm text-slate-500">
                      支付平台
                    </span>

                    <span className="text-sm font-semibold text-slate-900">
                      {
                        providerLabel
                      }
                    </span>
                  </div>


                  <div className="flex items-center justify-between gap-4 px-4 py-3">
                    <span className="text-sm text-slate-500">
                      订单编号
                    </span>

                    <span className="max-w-[220px] truncate font-mono text-xs font-medium text-slate-700">
                      {
                        order.id
                      }
                    </span>
                  </div>
                </div>


                {isPaid && (
                  <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5">
                    <p className="text-sm font-semibold text-emerald-900">
                      下一步
                    </p>

                    <p className="mt-1 text-xs leading-5 text-emerald-700">
                      付款已经确认。
                      您可以进入订单页面查看办理状态、
                      后续通知及需要您配合的事项。
                    </p>
                  </div>
                )}


                {isConfirming && (
                  <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3.5">
                    <p className="text-sm font-semibold text-blue-900">
                      为什么还在确认？
                    </p>

                    <p className="mt-1 text-xs leading-5 text-blue-700">
                      支付平台回到本页面与后台付款通知可能存在短暂时间差。
                      系统只会在收到并验证正式付款结果后更新订单状态。
                    </p>
                  </div>
                )}


                <div className="mt-6 grid gap-3">
                  {isFailed ||
                  isConfirming ? (
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="flex min-h-11 items-center justify-center rounded-xl bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800"
                    >
                      查看订单状态
                    </Link>
                  ) : (
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="flex min-h-11 items-center justify-center rounded-xl bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800"
                    >
                      查看订单进度
                    </Link>
                  )}


                  <Link
                    href="/account/orders"
                    className="flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    返回我的订单
                  </Link>
                </div>
              </div>


              <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3.5 text-center text-xs leading-5 text-slate-500 sm:px-6">
                付款状态以支付平台确认并经系统验证后的订单记录为准。
              </div>
            </section>
          </div>
        </div>
      </main>
    </PublicShell>
  );
}