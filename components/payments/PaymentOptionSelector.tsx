"use client";

import type { ServicePrice } from "@/types/servicePrice";

interface Props {
  prices: ServicePrice[];
  value: string;
  onChange: (priceId: string) => void;
}

function getPaymentLabel(
  paymentMethod: ServicePrice["paymentMethod"]
) {
  switch (paymentMethod) {
    case "local_payment":
      return "墨西哥本地付款";

    case "card":
      return "國際信用卡 / Debit Card";

    case "wechat_pay":
      return "微信人民幣付款";
  }
}

export default function PaymentOptionSelector({
  prices,
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-4">
      {prices.map((price) => {
        const selected = value === price.id;

        return (
          <button
            key={price.id}
            type="button"
            onClick={() => onChange(price.id)}
            className={`
              w-full
              rounded-xl
              border
              p-5
              text-left
              transition
              ${
                selected
                  ? "border-blue-600 ring-2 ring-blue-100"
                  : "border-gray-200 hover:border-gray-400"
              }
            `}
          >
            <p className="font-medium">
              {getPaymentLabel(price.paymentMethod)}
            </p>

            {price.paymentMethod === "card" && (
              <p className="mt-1 text-sm text-gray-500">
                Visa · Mastercard · American Express
              </p>
            )}

            <p className="mt-2 text-2xl font-semibold">
              {price.currency === "MXN"
                ? `MXN $${Number(price.amount).toFixed(2)}`
                : `CNY ¥${Number(price.amount).toFixed(2)}`}
            </p>
          </button>
        );
      })}
    </div>
  );
}