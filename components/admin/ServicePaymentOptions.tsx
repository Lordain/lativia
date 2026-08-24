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
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-bold text-slate-950">
            已配置付款方案
          </h3>

          <p className="mt-1.5 text-sm leading-6 text-slate-500">
            管理此服务可以使用的币种、金额和支付渠道。
            停用的付款方案不会提供给客户选择。
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
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            ＋ 新增付款方式
          </button>
        )}
      </div>

      {creating && (
        <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50/40 p-5">
          <div className="mb-4">
            <h4 className="font-bold text-blue-950">
              新增付款方式
            </h4>

            <p className="mt-1 text-sm text-blue-700">
              设置币种、收费金额、付款方式及支付平台。
            </p>
          </div>

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
        <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect
                x="2"
                y="5"
                width="20"
                height="14"
                rx="2"
              />

              <path d="M2 10h20" />
            </svg>
          </div>

          <p className="mt-3 text-sm font-semibold text-slate-700">
            尚未配置付款方式
          </p>

          <p className="mt-1 text-sm text-slate-500">
            新增至少一个启用的付款方案后，客户才能完成付款。
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {prices.map(
            price => {
              if (
                editingId ===
                price.id
              ) {
                return (
                  <div
                    key={
                      price.id
                    }
                    className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5"
                  >
                    <div className="mb-4">
                      <h4 className="font-bold text-blue-950">
                        编辑付款方式
                      </h4>

                      <p className="mt-1 text-sm text-blue-700">
                        修改后会影响之后新建立的订单。
                      </p>
                    </div>

                    <ServicePriceForm
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
                  </div>
                );
              }


              return (
                <div
                  key={
                    price.id
                  }
                  className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-slate-950">
                        {getPaymentProviderLabel(
                          price.paymentProvider
                        )}
                      </p>

                      <span
                        className={`
                          rounded-full
                          px-2.5
                          py-1
                          text-xs
                          font-semibold
                          ${
                            price.active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }
                        `}
                      >
                        {price.active
                          ? "启用"
                          : "停用"}
                      </span>
                    </div>

                    <p className="mt-2 text-xl font-bold tracking-tight text-slate-950">
                      {price.currency ===
                      "CNY"
                        ? `¥${price.amount.toFixed(
                            2
                          )} CNY`
                        : `$${price.amount.toFixed(
                            2
                          )} ${price.currency}`}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                      <span>
                        {getPaymentMethodLabel(
                          price.paymentMethod
                        )}
                      </span>

                      <span className="text-slate-300">
                        •
                      </span>

                      <span className="font-mono text-xs">
                        {
                          price.currency
                        }
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingId(
                          price.id
                        )
                      }
                      className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
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
                        rounded-xl
                        border
                        px-3.5
                        py-2
                        text-sm
                        font-semibold
                        transition
                        ${
                          price.active
                            ? "border-red-200 bg-white text-red-700 hover:bg-red-50"
                            : "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
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
    </div>
  );
}
