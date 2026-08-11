"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  orderId: string;
}

export default function RepairStripePaymentButton({
  orderId,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  async function handleRepair() {
    const confirmed =
      window.confirm(
        "系统将重新向 Stripe 验证付款，并在全部资料一致时修复订单付款状态。是否继续？"
      );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/admin/payments/repair-stripe",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            orderId,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "付款状态修复失败"
        );
      }

      setMessage(data.message);

      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "付款状态修复失败"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleRepair}
        disabled={loading}
        className="
          rounded-lg
          bg-red-600
          px-4
          py-2
          text-sm
          font-medium
          text-white
          hover:bg-red-700
          disabled:opacity-60
        "
      >
        {loading
          ? "正在安全修复..."
          : "安全修复付款状态"}
      </button>

      {message && (
        <p className="mt-2 text-sm text-gray-600">
          {message}
        </p>
      )}
    </div>
  );
}