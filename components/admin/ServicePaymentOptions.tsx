"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import ServicePriceForm from "@/components/admin/ServicePriceForm";

import {
  createServicePrice,
} from "@/lib/services/createServicePrice";

import {
  updateServicePrice,
} from "@/lib/services/updateServicePrice";

import {
  setServicePriceActive,
} from "@/lib/services/setServicePriceActive";

import type {
  AdminServicePrice,
  ServicePriceFormData,
} from "@/types/servicePriceAdmin";

interface Props {
  serviceId:
    string;

  prices:
    AdminServicePrice[];
}

function getPaymentMethodLabel(
  value: string
) {
  switch (value) {
    case "local_payment":
      return "本地付款";

    case "card":
      return "信用卡 / 借记卡";

    case "wechat_pay":
      return "微信支付";

    default:
      return value;
  }
}

function getPaymentProviderLabel(
  value:
    string | null
) {
  switch (value) {
    case "mercado_pago":
      return "Mercado Pago";

    case "stripe":
      return "Stripe";

    case "wechat_pay":
      return "WeChat Pay";

    default:
      return value ??
        "未设置";
  }
}

export default function ServicePaymentOptions({
  serviceId,
  prices,
}: Props) {
  const router =
    useRouter();

  const [
    creating,
    setCreating,
  ] =
    useState(false);

  const [
    editingId,
    setEditingId,
  ] =
    useState<
      string | null
    >(null);

  async function handleCreate(
    data:
      ServicePriceFormData
  ) {
    try {
      await createServicePrice(
        serviceId,
        data
      );

      setCreating(
        false
      );

      router.refresh();
    } catch (error) {
      console.error(
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "新增付款方式失败"
      );
    }
  }

  async function handleUpdate(
    priceId:
      string,
    data:
      ServicePriceFormData
  ) {
    try {
      await updateServicePrice(
        serviceId,
        priceId,
        data
      );

      setEditingId(
        null
      );

      router.refresh();
    } catch (error) {
      console.error(
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "更新付款方式失败"
      );
    }
  }

  async function handleToggle(
    price:
      AdminServicePrice
  ) {
    try {
      await setServicePriceActive(
        serviceId,
        price.id,
        !price.active
      );

      router.refresh();
    } catch (error) {
      console.error(
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "修改付款方式状态失败"
      );
    }
  }

  return (
    <section className="mt-8 rounded-xl border bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">
            付款方式
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            管理此服务可使用的币种、金额和支付渠道。
          </p>
        </div>

        {!creating && (
          <button
            type="button"
            onClick={() =>
              setCreating(
                true
              )
            }
            className="
              rounded-lg
              bg-blue-600
              px-4
              py-2
              text-sm
              font-medium
              text-white
              hover:bg-blue-700
            "
          >
            ＋ 新增付款方式
          </button>
        )}
      </div>

      {creating && (
        <div className="mt-5">
          <ServicePriceForm
            submitLabel="新增付款方式"
            onSubmit={
              handleCreate
            }
            onCancel={() =>
              setCreating(
                false
              )
            }
          />
        </div>
      )}

      {prices.length ===
      0 ? (
        <div className="mt-5 rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
          此服务目前没有付款方式。
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {prices.map(
            (price) => {
              if (
                editingId ===
                price.id
              ) {
                return (
                  <ServicePriceForm
                    key={
                      price.id
                    }
                    submitLabel="保存修改"
                    initialData={{
                      currency:
                        price.currency,

                      amount:
                        String(
                          price.amount
                        ),

                      paymentMethod:
                        price.paymentMethod,

                      paymentProvider:
                        price.paymentProvider ??
                        "",

                      active:
                        price.active,
                    }}
                    onSubmit={(
                      data
                    ) =>
                      handleUpdate(
                        price.id,
                        data
                      )
                    }
                    onCancel={() =>
                      setEditingId(
                        null
                      )
                    }
                  />
                );
              }

              return (
                <div
                  key={
                    price.id
                  }
                  className="flex flex-col gap-4 rounded-xl border p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">
                        {getPaymentProviderLabel(
                          price.paymentProvider
                        )}
                      </p>

                      <span
                        className={`
                          rounded-full
                          px-2
                          py-1
                          text-xs
                          font-medium
                          ${
                            price.active
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }
                        `}
                      >
                        {price.active
                          ? "启用"
                          : "停用"}
                      </span>
                    </div>

                    <p className="mt-2 text-lg font-bold">
                      {price.currency ===
                      "CNY"
                        ? `¥${price.amount.toFixed(
                            2
                          )} CNY`
                        : `$${price.amount.toFixed(
                            2
                          )} ${price.currency}`}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {getPaymentMethodLabel(
                        price.paymentMethod
                      )}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingId(
                          price.id
                        )
                      }
                      className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      编辑
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleToggle(
                          price
                        )
                      }
                      className={`
                        rounded-lg
                        border
                        px-3
                        py-2
                        text-sm
                        ${
                          price.active
                            ? "border-red-200 text-red-700 hover:bg-red-50"
                            : "border-green-200 text-green-700 hover:bg-green-50"
                        }
                      `}
                    >
                      {price.active
                        ? "停用"
                        : "启用"}
                    </button>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </section>
  );
}