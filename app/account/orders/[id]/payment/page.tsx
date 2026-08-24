import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import PublicShell from "@/components/layout/PublicShell";
import PayNowButton from "@/components/payments/PayNowButton";
import PaymentBadge from "@/components/orders/PaymentBadge";

import {
  getMyOrder,
} from "@/lib/orders/getMyOrder";

import {
  getPaymentMethodLabel,
  getPaymentProviderLabel,
} from "@/lib/payments/paymentLabel";

import type {
  PaymentMethod,
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


export default async function PaymentPage({
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


  const paymentMethodLabel =
    getPaymentMethodLabel(
      order
        .payment_method as
        PaymentMethod
    );

  const paymentProviderLabel =
    getPaymentProviderLabel(
      order
        .payment_provider as
        PaymentProvider
    );

  const amountLabel =
    formatAmount(
      order.amount,
      order.currency
    );

    const canPay =
    (
      order.payment_status ===
        "unpaid" ||
      order.payment_status ===
        "failed"
    ) &&
    (
      order.payment_provider ===
        "stripe" ||
      order.payment_provider ===
        "mercado_pago"
    );


  return (
    <PublicShell>
      <main className="min-h-[70vh] bg-slate-50">
        <div className="mx-auto w-full max-w-3xl px-4 py-7 sm:px-6 md:py-10">
          <Link
            href={`/account/orders/${order.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-blue-700"
          >
            <span aria-hidden="true">
              ←
            </span>

            返回订单
          </Link>


          <div className="mt-6">
            <p className="text-xs font-bold tracking-[0.12em] text-blue-700">
              PAYMENT
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              确认付款
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              完成付款后，我们才会开始处理您的服务申请。
            </p>
          </div>


          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-400">
                    订单服务
                  </p>

                  <h2 className="mt-1 text-base font-bold leading-6 text-slate-950 sm:text-lg">
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


                <PaymentBadge
                  status={
                    order.payment_status as
                      PaymentStatus
                  }
                />
              </div>
            </div>


            <div className="px-5 py-6 sm:px-6">
              <div>
                <p className="text-xs font-medium text-slate-400">
                  应付金额
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                  {
                    amountLabel
                  }
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {
                    order.currency ??
                    "MXN"
                  }
                </p>
              </div>


              <div className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-slate-50/60">
                <div className="flex items-center justify-between gap-5 px-4 py-3.5">
                  <span className="text-sm text-slate-500">
                    付款方式
                  </span>

                  <span className="text-right text-sm font-semibold text-slate-900">
                    {
                      paymentMethodLabel
                    }
                  </span>
                </div>


                <div className="flex items-center justify-between gap-5 px-4 py-3.5">
                  <span className="text-sm text-slate-500">
                    支付平台
                  </span>

                  <span className="text-right text-sm font-semibold text-slate-900">
                    {
                      paymentProviderLabel
                    }
                  </span>
                </div>
              </div>


              {canPay && (
                <div className="mt-6">
                  <PayNowButton
                    orderId={
                      order.id
                    }
                    provider={
                      order.payment_provider as
                        PaymentProvider
                    }
                  />
                </div>
              )}


              {order.payment_status ===
                "paid" && (
                <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5">
                  <p className="text-sm font-semibold text-emerald-900">
                    此订单已经完成付款
                  </p>

                  <p className="mt-1 text-xs leading-5 text-emerald-700">
                    无需再次付款，可以返回订单查看当前办理状态。
                  </p>
                </div>
              )}


              {order.payment_status ===
                "refunded" && (
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5">
                  <p className="text-sm font-semibold text-slate-900">
                    此订单已经退款
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    当前订单不再接受新的付款。
                  </p>
                </div>
              )}


              <div className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3.5">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="5"
                      y="10"
                      width="14"
                      height="10"
                      rx="2"
                    />

                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    安全付款
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    付款由第三方支付平台安全处理。
                    Lativia 不保存您的完整银行卡号码、
                    CVV 或银行登录凭证。
                  </p>
                </div>
              </div>
            </div>


            <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3.5 text-center text-xs leading-5 text-slate-500 sm:px-6">
              付款完成后系统会更新订单状态，
              您可以随时在「我的订单」查看进度。
            </div>
          </section>
        </div>
      </main>
    </PublicShell>
  );
}