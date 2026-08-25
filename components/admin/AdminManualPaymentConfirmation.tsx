"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { confirmManualWeChatPayment } from "@/lib/payments/confirmManualWeChatPayment";

interface Props {
  orderId: string;

  amountLabel: string;
}

export default function AdminManualPaymentConfirmation({
  orderId,
  amountLabel,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (loading) {
      return;
    }

    const confirmed = window.confirm(
      `请确认您已经实际收到 ${amountLabel} 的微信转账。\n\n确认后订单会立即标记为「已付款」，并进入后续服务流程。\n\n请勿仅根据客户截图或口头说明进行确认。`,
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const result = await confirmManualWeChatPayment(orderId);

      if (result.alreadyConfirmed) {
        alert("此订单已经确认付款，无需重复操作。");
      } else {
        alert("人工收款确认成功，订单已经标记为已付款。");
      }

      router.refresh();
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : "确认人工收款失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-bold text-amber-950">人工微信收款待确认</p>

          <p className="mt-1 text-sm leading-6 text-amber-800">
            只有在您已经实际核对并收到客户转账后， 才可以确认付款。
            客户提供的付款截图不能单独作为收款确认依据。
          </p>
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={loading}
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "确认中..." : `确认已收 ${amountLabel}`}
        </button>
      </div>
    </div>
  );
}
