"use client";

import { useState } from "react";

import type {
  PaymentProvider,
} from "@/types/payment";

import {
  getPaymentRoute,
} from "@/lib/payments/provider";

interface Props {
  orderId: string;

  provider:
    PaymentProvider;
}

interface PaymentApiResponse {
  url?: string;
  checkoutUrl?: string;

  initPoint?: string;
  init_point?: string;

  sandboxInitPoint?: string;
  sandbox_init_point?: string;

  error?: string;

  [key: string]: unknown;
}

export default function PayNowButton({
  orderId,
  provider,
}: Props) {
  const [
    loading,
    setLoading,
  ] = useState(false);

  async function handlePayment() {
    const route =
      getPaymentRoute(
        provider
      );

    if (!route) {
      alert(
        "此付款方式尚未配置完成"
      );

      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          route,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                orderId,
              }),
          }
        );

      const result:
        PaymentApiResponse =
        await response.json();

      if (!response.ok) {
        throw new Error(
          typeof result.error ===
            "string"
            ? result.error
            : "建立付款失败"
        );
      }

      const paymentUrl =
        result.url ??
        result.checkoutUrl ??
        result.initPoint ??
        result.init_point ??
        result.sandboxInitPoint ??
        result.sandbox_init_point;

      if (
        typeof paymentUrl !==
          "string" ||
        !paymentUrl
      ) {
        throw new Error(
          "支付平台已响应，但没有返回可用的付款地址"
        );
      }

      window.location.href =
        paymentUrl;
    } catch (error) {
      console.error(
        "PAYMENT ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "付款失败，请稍后再试"
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  return (
    <button
      type="button"
      onClick={
        handlePayment
      }
      disabled={
        loading ||
        !provider
      }
      className="
        w-full
        rounded-lg
        bg-blue-600
        px-6
        py-3
        font-medium
        text-white
        transition
        hover:bg-blue-700
        disabled:cursor-not-allowed
        disabled:bg-gray-400
        disabled:opacity-60
      "
    >
      {loading
        ? "正在建立付款..."
        : provider
          ? "立即付款"
          : "付款方式尚未配置"}
    </button>
  );
}