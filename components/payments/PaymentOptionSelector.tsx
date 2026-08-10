"use client";

import type { ServicePrice } from "@/types/servicePrice";

interface Props {
  prices: ServicePrice[];
  value: string;
  onChange: (priceId: string) => void;
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
              {price.currency === "MXN"
                ? "墨西哥付款"
                : "微信人民币付款"}
            </p>

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