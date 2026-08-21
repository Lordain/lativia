"use client";

import type {
  ServicePrice,
} from "@/types/servicePrice";

interface Props {
  prices:
    ServicePrice[];

  value:
    string;

  onChange:
    (
      priceId: string
    ) => void;
}

function getPaymentLabel(
  paymentMethod:
    ServicePrice["paymentMethod"]
) {
  switch (
    paymentMethod
  ) {
    case "local_payment":
      return "墨西哥本地付款";

    case "card":
      return "国际信用卡 / Debit Card";

    case "wechat_pay":
      return "微信支付";

    default:
      return paymentMethod;
  }
}

function getPaymentDescription(
  paymentMethod:
    ServicePrice["paymentMethod"]
) {
  switch (
    paymentMethod
  ) {
    case "local_payment":
      return "通过 Mercado Pago 完成付款";

    case "card":
      return "Visa · Mastercard · American Express";

    case "wechat_pay":
      return "使用微信扫一扫完成付款";

    default:
      return null;
  }
}

function formatAmount(
  price: ServicePrice
) {
  const amount =
    new Intl.NumberFormat(
      "zh-CN",
      {
        maximumFractionDigits:
          2,
      }
    ).format(
      Number(
        price.amount
      )
    );


  switch (
    price.currency
  ) {
    case "MXN":
      return `MXN $${amount}`;

    case "CNY":
      return `CNY ¥${amount}`;

    default:
      return `${price.currency} ${amount}`;
  }
}

export default function PaymentOptionSelector({
  prices,
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-4">
      {prices.map(
        (price) => {
          const selected =
            value ===
            price.id;

          const description =
            getPaymentDescription(
              price.paymentMethod
            );

          return (
            <button
              key={
                price.id
              }
              type="button"
              onClick={() =>
                onChange(
                  price.id
                )
              }
              className={`
                w-full
                rounded-xl
                border
                p-5
                text-left
                transition
                ${
                  selected
                    ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }
              `}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">
                    {getPaymentLabel(
                      price.paymentMethod
                    )}
                  </p>

                  {description && (
                    <p className="mt-1 text-sm text-gray-500">
                      {
                        description
                      }
                    </p>
                  )}
                </div>

                {selected && (
                  <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-medium text-white">
                    已选择
                  </span>
                )}
              </div>

              <p className="mt-3 text-2xl font-semibold">
                {formatAmount(
                  price
                )}
              </p>
            </button>
          );
        }
      )}
    </div>
  );
}