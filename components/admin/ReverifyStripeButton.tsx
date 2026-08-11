"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  orderId: string;
}

export default function ReverifyStripeButton({
  orderId,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  async function handleVerify() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/admin/payments/reverify-stripe",
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
            data.message ??
            "重新验证失败"
        );
      }

      setMessage(
        data.message ??
          "Stripe 重新验证完成"
      );

      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "重新验证失败"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleVerify}
        disabled={loading}
        className="
          rounded-lg
          border
          px-4
          py-2
          text-sm
          font-medium
          hover:bg-gray-50
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {loading
          ? "正在向 Stripe 验证..."
          : "向 Stripe 重新验证"}
      </button>

      {message && (
        <p className="mt-2 text-sm text-gray-600">
          {message}
        </p>
      )}
    </div>
  );
}