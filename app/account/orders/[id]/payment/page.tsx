import Link from "next/link";

import { notFound } from "next/navigation";

import PublicShell from "@/components/layout/PublicShell";
import PayNowButton from "@/components/payments/PayNowButton";
import PaymentBadge from "@/components/orders/PaymentBadge";

import { getMyOrder } from "@/lib/orders/getMyOrder";

import {
  SUPPORT_WHATSAPP,
  hasSupportWhatsApp,
} from "@/lib/support/contact";

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
  params: Promise<{
    id: string;
  }>;
}

function formatAmount(amount: number | string | null, currency: string | null) {
  const numericAmount = Number(amount ?? 0);

  if (currency === "CNY") {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 2,
    }).format(numericAmount);
  }

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(numericAmount);
}

export default async function PaymentPage({ params }: Props) {
  const { id } = await params;

  const order = await getMyOrder(id);

  if (!order) {
    notFound();
  }

  const paymentMethodLabel = getPaymentMethodLabel(
    order.payment_method as PaymentMethod,
  );

  const paymentProviderLabel = getPaymentProviderLabel(
    order.payment_provider as PaymentProvider,
  );

  const amountLabel = formatAmount(order.amount, order.currency);

  const isManualWeChatPayment =
    order.currency === "CNY" &&
    order.payment_method === "wechat_pay" &&
    order.payment_provider === null;

  const whatsappMessage =
    `您好，我想咨询 Lativia 订单 ${order.id} 的人民币微信付款方式。`;


  const whatsappHref =
    hasSupportWhatsApp
      ? `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(
          whatsappMessage
        )}`
      : null;

  const canPay =
    (order.payment_status === "unpaid" || order.payment_status === "failed") &&
    (order.payment_provider === "stripe" ||
      order.payment_provider === "mercado_pago");

  return (
    <PublicShell>
      <main className="min-h-[70vh] bg-slate-50">
        <div className="mx-auto w-full max-w-3xl px-4 py-7 sm:px-6 md:py-10">
          <Link
            href={`/account/orders/${order.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-blue-700"
          >
            <span aria-hidden="true">←</span>
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
                  <p className="text-xs font-medium text-slate-400">订单服务</p>

                  <h2 className="mt-1 text-base font-bold leading-6 text-slate-950 sm:text-lg">
                    {(order.services?.title ?? "服务订单").replaceAll(
                      "公司",
                      "企业",
                    )}
                  </h2>
                </div>

                <PaymentBadge status={order.payment_status as PaymentStatus} />
              </div>
            </div>

            <div className="px-5 py-6 sm:px-6">
              <div>
                <p className="text-xs font-medium text-slate-400">应付金额</p>

                <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                  {amountLabel}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {order.currency ?? "MXN"}
                </p>
              </div>

              <div className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-slate-50/60">
                <div className="flex items-center justify-between gap-5 px-4 py-3.5">
                  <span className="text-sm text-slate-500">付款方式</span>

                  <span className="text-right text-sm font-semibold text-slate-900">
                    {paymentMethodLabel}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-5 px-4 py-3.5">
                  <span className="text-sm text-slate-500">支付平台</span>

                  <span className="text-right text-sm font-semibold text-slate-900">
                    {isManualWeChatPayment
                      ? "人工收款确认"
                      : paymentProviderLabel}
                  </span>
                </div>
              </div>

              {canPay && (
                <div className="mt-6">
                  <PayNowButton
                    orderId={order.id}
                    provider={order.payment_provider as PaymentProvider}
                  />
                </div>
              )}

              {isManualWeChatPayment && order.payment_status === "unpaid" && (
                <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50/70 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
                      </svg>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-950">
                        人民币微信人工付款
                      </p>

                      <p className="mt-1.5 text-sm leading-6 text-slate-600">
                      此付款方式由 Lativia
                      客服人工提供微信收款信息。
                      请通过官方 WhatsApp 联系客服，
                      获取本订单的付款方式后再进行转账。
                      </p>

                      <div className="mt-4 rounded-xl border border-blue-100 bg-white px-4 py-3">
                        <p className="text-xs font-medium text-slate-500">
                          本订单应付金额
                        </p>

                        <p className="mt-1 text-xl font-bold tracking-tight text-slate-950">
                          {amountLabel}
                        </p>
                      </div>

                      {whatsappHref ? (
                        <a
                          href={
                            whatsappHref
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800 sm:w-auto"
                        >
                          通过 WhatsApp 联系客服
                        </a>
                      ) : (
                        <Link
                          href="/help"
                          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800 sm:w-auto"
                        >
                          前往帮助中心联系客服
                        </Link>
                      )}

                      <p className="mt-3 text-xs leading-5 text-slate-500">
                        完成转账后无需在网站自行确认付款。 客服核对实际到账后，
                        管理员会更新订单付款状态。
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isManualWeChatPayment && order.payment_status === "failed" && (
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
                  <p className="text-sm font-semibold text-amber-950">
                    请联系客服确认付款状态
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-800">
                    此订单使用人民币微信人工付款， 不需要重新发起第三方支付。
                    请通过官方 WhatsApp 联系客服核对付款情况。
                  </p>
                </div>
              )}

              {order.payment_status === "paid" && (
                <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5">
                  <p className="text-sm font-semibold text-emerald-900">
                    此订单已经完成付款
                  </p>

                  <p className="mt-1 text-xs leading-5 text-emerald-700">
                    无需再次付款，可以返回订单查看当前办理状态。
                  </p>
                </div>
              )}

              {order.payment_status === "refunded" && (
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
                    <rect x="5" y="10" width="14" height="10" rx="2" />

                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    {isManualWeChatPayment ? "人工付款安全提醒" : "安全付款"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {isManualWeChatPayment ? (
                      <>
                        请只通过 Lativia
                        帮助中心公布的官方客服渠道获取付款方式。 Lativia
                        不会要求您提供微信密码、
                        银行密码、短信验证码或其他账户登录凭证。
                      </>
                    ) : (
                      <>
                        付款由第三方支付平台安全处理。 Lativia
                        不保存您的完整银行卡号码、 CVV 或银行登录凭证。
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3.5 text-center text-xs leading-5 text-slate-500 sm:px-6">
              {isManualWeChatPayment ? (
                <>
                  人工付款将在客服核对实际到账后更新订单状态，
                  您可以随时在「我的订单」查看确认结果。
                </>
              ) : (
                <>
                  付款完成后系统会更新订单状态，
                  您可以随时在「我的订单」查看进度。
                </>
              )}
            </div>
          </section>
        </div>
      </main>
    </PublicShell>
  );
}
