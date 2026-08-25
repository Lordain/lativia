"use client";

import type {
  ServiceOptionSummary,
  ServicePrice,
} from "@/types/servicePrice";


interface Props {
  prices:
    ServicePrice[];

  value:
    string;

  onChange:
    (
      serviceOptionId: string
    ) => void;
}


interface OptionWithPrice {
  option:
    ServiceOptionSummary;

  minimumAmount:
    number;

  currency:
    string;
}


function getRegionDescription(
  option:
    ServiceOptionSummary
) {
  if (
    option.serviceMode ===
    "appointment_only"
  ) {
    return "墨西哥全国可提供";
  }

  return "目前仅限墨西哥城（CDMX）及墨西哥州（Estado de México）";
}


function getDocumentDescription(
  option:
    ServiceOptionSummary
) {
  if (
    option.requiresDocumentReview
  ) {
    return "付款后需上传办理资料，由工作人员提前检查";
  }

  return "预约协助仅需填写办理所需信息，无需上传资料";
}


function formatAmount(
  amount:
    number,
  currency:
    string
) {
  const formatted =
    new Intl.NumberFormat(
      "zh-CN",
      {
        maximumFractionDigits:
          2,
      }
    ).format(
      amount
    );


  if (
    currency === "MXN"
  ) {
    return `MXN $${formatted}`;
  }


  if (
    currency === "CNY"
  ) {
    return `CNY ¥${formatted}`;
  }


  return `${currency} ${formatted}`;
}


export default function ServiceOptionSelector({
  prices,
  value,
  onChange,
}: Props) {
  /*
   * 同一个 Service Option 可能拥有：
   *
   * Mercado Pago
   * Stripe
   * WeChat Pay
   *
   * 因此前端只显示一次业务方案。
   */

  const optionMap =
    new Map<
      string,
      OptionWithPrice
    >();


  for (
    const price
    of prices
  ) {
    const option =
      price.serviceOption;

    if (
      !option ||
      !price.serviceOptionId ||
      !option.active
    ) {
      continue;
    }


    const existing =
      optionMap.get(
        option.id
      );


    const shouldUsePrice =
      !existing ||
      (
        price.currency === "MXN" &&
        existing.currency !== "MXN"
      ) ||
      (
        price.currency ===
          existing.currency &&
        price.amount <
          existing.minimumAmount
      );

    if (
      shouldUsePrice
    ) {
      optionMap.set(
        option.id,
        {
          option,

          minimumAmount:
            price.amount,

          currency:
            price.currency,
        }
      );
    }
  }


  const options =
    Array.from(
      optionMap.values()
    ).sort(
      (
        a,
        b
      ) =>
        a.option.sortOrder -
        b.option.sortOrder
    );


  if (
    options.length ===
    0
  ) {
    return null;
  }


  return (
    <div className="space-y-4">
      {options.map(
        ({
          option,
          minimumAmount,
          currency,
        }) => {
          const selected =
            value ===
            option.id;


          return (
            <button
              key={
                option.id
              }
              type="button"
              onClick={() =>
                onChange(
                  option.id
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
                  <p className="text-lg font-semibold text-gray-900">
                    {
                      option.title
                    }
                  </p>

                  {option.description && (
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {
                        option.description
                      }
                    </p>
                  )}
                </div>


                {selected && (
                  <span className="shrink-0 rounded-full bg-blue-600 px-2 py-1 text-xs font-medium text-white">
                    已选择
                  </span>
                )}
              </div>


              <div className="mt-4 space-y-1 text-sm text-gray-600">
                <p>
                  {
                    getRegionDescription(
                      option
                    )
                  }
                </p>

                <p>
                  {
                    getDocumentDescription(
                      option
                    )
                  }
                </p>
              </div>


              <p className="mt-4 text-xl font-semibold text-gray-900">
                {formatAmount(
                  minimumAmount,
                  currency
                )}
              </p>
            </button>
          );
        }
      )}
    </div>
  );
}