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

    if (
      active &&
      !paymentProvider
    ) {
      alert(
        "启用付款方式前必须选择 Payment Provider"
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
      className="space-y-4 rounded-xl border bg-gray-50 p-5"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {/* Currency */}

        <div>
          <label className="mb-1 block text-sm font-medium">
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
            className="w-full rounded-lg border bg-white px-3 py-2"
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
          <label className="mb-1 block text-sm font-medium">
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
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        {/* Payment Method */}

        <div>
          <label className="mb-1 block text-sm font-medium">
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
            className="w-full rounded-lg border bg-white px-3 py-2"
          >
            <option value="local_payment">
              墨西哥本地付款
            </option>

            <option value="card">
              信用卡 / 借记卡
            </option>

            <option value="wechat_pay">
              微信支付
            </option>
          </select>
        </div>

        {/* Provider */}

        <div>
          <label className="mb-1 block text-sm font-medium">
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
            className="w-full rounded-lg border bg-white px-3 py-2"
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

      <label className="flex items-start gap-3 rounded-lg border bg-white p-4">
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
          className="mt-0.5"
        />

        <div>
          <p className="text-sm font-medium">
            启用此付款方式
          </p>

          <p className="mt-1 text-xs text-gray-500">
            只有启用中的付款方式才会显示给客户。
          </p>
        </div>
      </label>

      {!paymentProvider && (
        <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
          此付款方式尚未绑定正式 Payment Provider，
          请保持停用状态。
        </div>
      )}

      {/* Actions */}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={
            loading
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
            className="rounded-lg border bg-white px-4 py-2 text-sm"
          >
            取消
          </button>
        )}
      </div>
    </form>
  );
}