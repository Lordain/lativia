"use client";

import {
  useState,
} from "react";

import type {
  Currency,
  PaymentMethod,
} from "@/types/payment";

import type {
  ServicePriceFormData,
} from "@/types/servicePriceAdmin";

interface Props {
  initialData?:
    ServicePriceFormData;

  submitLabel:
    string;

  onSubmit:
    (
      data:
        ServicePriceFormData
    ) =>
      Promise<void>;

  onCancel?:
    () => void;
}

export default function ServicePriceForm({
  initialData,
  submitLabel,
  onSubmit,
  onCancel,
}: Props) {
  const [
    currency,
    setCurrency,
  ] =
    useState<Currency>(
      initialData
        ?.currency ??
        "MXN"
    );

  const [
    amount,
    setAmount,
  ] =
    useState(
      initialData
        ?.amount ??
        ""
    );

  const [
    paymentMethod,
    setPaymentMethod,
  ] =
    useState<PaymentMethod>(
      initialData
        ?.paymentMethod ??
        "local_payment"
    );

  const [
    paymentProvider,
    setPaymentProvider,
  ] =
    useState<
      ServicePriceFormData["paymentProvider"]
    >(
      initialData
        ?.paymentProvider ??
        ""
    );

  const [
    active,
    setActive,
  ] =
    useState(
      initialData
        ?.active ??
        true
    );

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const isManualWeChatPayment =
    currency ===
      "CNY" &&
    paymentMethod ===
      "wechat_pay" &&
    !paymentProvider;


  if (
    active &&
    !paymentProvider &&
    !isManualWeChatPayment
  ) {
    alert(
      "启用付款方式前必须选择 Payment Provider；仅人民币微信人工付款允许不绑定 Provider"
    );

    return;
  }

    setLoading(true);

    try {
      await onSubmit({
        currency,
        amount,
        paymentMethod,
        paymentProvider,
        active,
      });
    } finally {
      setLoading(
        false
      );
    }
  }

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {/* Currency */}

        <div>
          <label className="mb-1 block text-sm font-semibold">
            币种
          </label>

          <select
            value={
              currency
            }
            onChange={(
              event
            ) =>
              setCurrency(
                event.target
                  .value as Currency
              )
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
          >
            <option value="MXN">
              MXN — 墨西哥比索
            </option>

            <option value="CNY">
              CNY — 人民币
            </option>
          </select>
        </div>

        {/* Amount */}

        <div>
          <label className="mb-1 block text-sm font-semibold">
            金额
          </label>

          <input
            type="number"
            min="0.01"
            step="0.01"
            value={
              amount
            }
            onChange={(
              event
            ) =>
              setAmount(
                event.target
                  .value
              )
            }
            placeholder="例如：500"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
          />
        </div>

        {/* Payment Method */}

        <div>
          <label className="mb-1 block text-sm font-semibold">
            客户付款方式
          </label>

          <select
            value={
              paymentMethod
            }
            onChange={(
              event
            ) =>
              setPaymentMethod(
                event.target
                  .value as PaymentMethod
              )
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
          >
            <option value="local_payment">
              墨西哥本地付款
            </option>

            <option value="card">
              信用卡 / 借记卡
            </option>

            <option value="wechat_pay">
              人民币微信付款
            </option>
          </select>
        </div>

        {/* Provider */}

        <div>
          <label className="mb-1 block text-sm font-semibold">
            Payment Provider
          </label>

          <select
            value={
              paymentProvider
            }
            onChange={(
              event
            ) =>
              setPaymentProvider(
                event.target
                  .value as
                  ServicePriceFormData["paymentProvider"]
              )
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
          >
            <option value="">
              尚未配置
            </option>

            <option value="mercado_pago">
              Mercado Pago
            </option>

            <option value="stripe">
              Stripe
            </option>

            <option value="nuvei">
              Nuvei
            </option>
          </select>
        </div>
      </div>

      {/* Status */}

      <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <input
          type="checkbox"
          checked={
            active
          }
          onChange={(
            event
          ) =>
            setActive(
              event.target
                .checked
            )
          }
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600"
        />

        <div>
          <p className="text-sm font-semibold">
            启用此付款方式
          </p>

          <p className="mt-1 text-xs text-slate-500">
            只有启用中的付款方式才会显示给客户。
          </p>
        </div>
      </label>

      {!paymentProvider && (
        currency ===
          "CNY" &&
        paymentMethod ===
          "wechat_pay" ? (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800">
            当前配置为人民币微信人工付款。
            无需绑定 Payment Provider，
            客户下单后将通过官方客服获取付款方式，
            并由管理员在实际到账后人工确认。
          </div>
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
            此付款方式尚未绑定正式 Payment Provider。
            如果启用此付款方式，
            请先选择对应的支付平台。
          </div>
        )
      )}

      {/* Actions */}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={
            loading
          }
          className="
            rounded-xl
            bg-blue-600
            px-4
            py-2
            text-sm
            font-medium
            text-white
            hover:bg-blue-700
            disabled:opacity-60
          "
        >
          {loading
            ? "保存中..."
            : submitLabel}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={
              onCancel
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm"
          >
            取消
          </button>
        )}
      </div>
    </form>
  );
}
