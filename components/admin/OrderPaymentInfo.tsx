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
      ).toFixed(2);

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
    <section className="mt-8">
      <h2 className="text-xl font-semibold">
        付款信息
      </h2>

      <div className="mt-4 rounded-xl border bg-white p-5">
        <PaymentBadge
          status={
            paymentStatus
          }
        />

        <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
          <p>
            <span className="text-gray-500">
              订单金额：
            </span>

            <span className="ml-2 font-medium">
              {formatAmount()}
            </span>
          </p>

          <p>
            <span className="text-gray-500">
              付款方式：
            </span>

            <span className="ml-2">
              {paymentMethod
                ? getPaymentMethodLabel(
                    paymentMethod
                  )
                : "未设置"}
            </span>
          </p>

          <p>
            <span className="text-gray-500">
              支付平台：
            </span>

            <span className="ml-2">
              {paymentProvider
                ? getPaymentProviderLabel(
                    paymentProvider
                  )
                : "未设置"}
            </span>
          </p>

          <p>
            <span className="text-gray-500">
              付款时间：
            </span>

            <span className="ml-2">
              {paidAt
                ? formatBusinessDateTime(
                    paidAt
                  )
                : "尚未付款"}
            </span>
          </p>
        </div>

        <p className="mt-4 border-t pt-4 text-xs text-gray-500">
          付款状态由支付系统、Webhook
          与对账流程维护，管理员不能在此手动修改。
        </p>
      </div>
    </section>
  );
}