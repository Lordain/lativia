"use client";

import {
  useState,
} from "react";

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
    useState(
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
    useState(
      initialData
        ?.paymentMethod ??
        "local_payment"
    );

  const [
    paymentProvider,
    setPaymentProvider,
  ] =
    useState(
      initialData
        ?.paymentProvider ??
        "mercado_pago"
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
                  .value
              )
            }
            className="w-full rounded-lg border bg-white px-3 py-2"
          >
            <option value="MXN">
              MXN
            </option>

            <option value="CNY">
              CNY
            </option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            金额
          </label>

          <input
            type="number"
            min="0"
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

        <div>
          <label className="mb-1 block text-sm font-medium">
            付款方式
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
                  .value
              )
            }
            className="w-full rounded-lg border bg-white px-3 py-2"
          >
            <option value="local_payment">
              本地付款
            </option>

            <option value="card">
              信用卡 / 借记卡
            </option>

            <option value="wechat_pay">
              微信支付
            </option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            支付平台
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
                  .value
              )
            }
            className="w-full rounded-lg border bg-white px-3 py-2"
          >
            <option value="mercado_pago">
              Mercado Pago
            </option>

            <option value="stripe">
              Stripe
            </option>

            <option value="wechat_pay">
              WeChat Pay
            </option>
          </select>
        </div>
      </div>

      <label className="flex items-center gap-3">
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
        />

        <span className="text-sm font-medium">
          启用此付款方式
        </span>
      </label>

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