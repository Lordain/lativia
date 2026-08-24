import PaymentBadge from "@/components/orders/PaymentBadge";

import {
  formatBusinessDateTime,
} from "@/lib/time/formatBusinessDateTime";

import {
  getPaymentMethodLabel,
  getPaymentProviderLabel,
} from "@/lib/payments/paymentLabel";

import type {
  PaymentStatus,
  PaymentMethod,
  PaymentProvider,
} from "@/types/payment";


interface Props {
  paymentStatus:
    PaymentStatus;

  amount:
    number |
    string |
    null;

  currency:
    string | null;

  paymentMethod:
    PaymentMethod |
    null;

  paymentProvider:
    PaymentProvider |
    null;

  paidAt:
    string | null;
}


export default function OrderPaymentInfo({
  paymentStatus,
  amount,
  currency,
  paymentMethod,
  paymentProvider,
  paidAt,
}: Props) {
  function formatAmount() {
    if (
      amount === null ||
      !currency
    ) {
      return "未设置";
    }


    const value =
      Number(
        amount
      ).toFixed(
        2
      );


    if (
      currency ===
      "CNY"
    ) {
      return `¥${value} CNY`;
    }


    if (
      currency ===
      "MXN"
    ) {
      return `$${value} MXN`;
    }


    return `${value} ${currency}`;
  }


  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:px-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950">
            付款信息
          </h2>

          <p className="mt-1.5 text-sm leading-6 text-slate-500">
            查看订单金额、付款方式与支付确认状态。
          </p>
        </div>

        <PaymentBadge
          status={
            paymentStatus
          }
        />
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-medium text-slate-500">
              订单金额
            </p>

            <p className="mt-1.5 font-bold text-slate-950">
              {formatAmount()}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-medium text-slate-500">
              付款方式
            </p>

            <p className="mt-1.5 text-sm font-semibold text-slate-900">
              {paymentMethod
                ? getPaymentMethodLabel(
                    paymentMethod
                  )
                : "未设置"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-medium text-slate-500">
              支付平台
            </p>

            <p className="mt-1.5 text-sm font-semibold text-slate-900">
              {paymentProvider
                ? getPaymentProviderLabel(
                    paymentProvider
                  )
                : "未设置"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-medium text-slate-500">
              付款时间
            </p>

            <p className="mt-1.5 text-sm font-semibold text-slate-900">
              {paidAt
                ? formatBusinessDateTime(
                    paidAt
                  )
                : "尚未付款"}
            </p>
          </div>
        </div>

        <p className="mt-5 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
          付款状态由支付系统、Webhook
          与支付对账流程维护，管理员不能在此手动修改。
        </p>
      </div>
    </section>
  );
}