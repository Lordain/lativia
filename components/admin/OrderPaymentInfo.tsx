import PaymentBadge from "@/components/orders/PaymentBadge";

import type {
  PaymentStatus,
  PaymentMethod,
  PaymentProvider,
} from "@/types/payment";

import {
  getPaymentMethodLabel,
  getPaymentProviderLabel,
} from "@/lib/payments/paymentLabel";

interface Props {
  paymentStatus: PaymentStatus;

  amount: number | string | null;

  currency: string | null;

  paymentMethod:
    | PaymentMethod
    | null;

  paymentProvider:
    | PaymentProvider
    | null;

  paidAt: string | null;
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
      return "未設定";
    }

    const value =
      Number(amount).toFixed(2);

    if (currency === "CNY") {
      return `¥${value} CNY`;
    }

    if (currency === "MXN") {
      return `$${value} MXN`;
    }

    return `${value} ${currency}`;
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold">
        付款資訊
      </h2>

      <div className="mt-4 rounded-xl border p-5">
        <div>
          <PaymentBadge
            status={paymentStatus}
          />
        </div>

        <div className="mt-5 space-y-3 text-sm">
          <p>
            <span className="text-gray-500">
              訂單金額：
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
                : "未設定"}
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
                : "未設定"}
            </span>
          </p>

          <p>
            <span className="text-gray-500">
              付款時間：
            </span>

            <span className="ml-2">
              {paidAt
                ? new Date(
                    paidAt
                  ).toLocaleString()
                : "尚未付款"}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}