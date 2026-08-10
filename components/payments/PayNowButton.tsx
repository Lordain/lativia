"use client";

import { useState } from "react";

import type { PaymentProvider } from "@/types/payment";
import { getPaymentRoute } from "@/lib/payments/provider";

interface Props {
  orderId: string;
  provider: PaymentProvider;
}

export default function PayNowButton({
  orderId,
  provider,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);

    try {
      const route = getPaymentRoute(provider);

      const response = await fetch(route, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "建立付款失敗"
        );
      }

      if (!data.checkoutUrl) {
        throw new Error(
          "沒有取得付款網址"
        );
      }

      window.location.href =
        data.checkoutUrl;
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "付款建立失敗"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handlePay}
      disabled={loading}
      className="
        mt-6
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
        disabled:opacity-60
      "
    >
      {loading
        ? "正在前往付款..."
        : "立即付款"}
    </button>
  );
}