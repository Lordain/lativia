"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  executeAdminRefund,
} from "@/lib/refunds/executeAdminRefund";

import type {
  Refund,
} from "@/types/refund";

interface Props {
  refund: Refund;
}

export default function AdminRefundExecution({
  refund,
}: Props) {
  const router =
    useRouter();

  const [
    loading,
    setLoading,
  ] =
    useState(
      false
    );

  const canExecute =
    refund.status ===
      "approved" ||
    refund.status ===
      "failed";

  if (
    refund.status ===
    "pending_review"
  ) {
    return null;
  }

  async function handleExecute() {
    if (
      loading ||
      !canExecute
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        refund.status ===
          "failed"
          ? "确定重新执行这笔退款吗？系统会使用同一个幂等键，避免重复退款。"
          : `确定执行 ${refund.currency} ${refund.amount.toFixed(
              2
            )} 的原路退款吗？此操作会真正向支付平台发起退款。`
      );

    if (
      !confirmed
    ) {
      return;
    }

    setLoading(
      true
    );

    try {
      const result =
        await executeAdminRefund(
          refund.id,
          refund.orderId
        );

      if (
        result.status ===
        "succeeded"
      ) {
        alert(
          "退款已经成功提交并由支付平台确认。"
        );
      } else {
        alert(
          "支付平台已经接受退款请求，目前仍在处理中。"
        );
      }

      router.refresh();

    } catch (
      error
    ) {
      console.error(
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "执行退款失败"
      );

      router.refresh();

    } finally {
      setLoading(
        false
      );
    }
  }

  return (
    <section className="mt-5 rounded-xl border bg-white p-5">
      <div>
        <h3 className="font-semibold">
          退款执行
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          退款将按照原付款渠道原路退回。
          Stripe 订单由 Stripe 执行，
          Mercado Pago 订单由 Mercado Pago 执行。
        </p>
      </div>

      {refund.status ===
        "approved" && (
        <div className="mt-4">
          <div className="rounded-lg bg-amber-50 p-4 text-sm leading-6 text-amber-800">
            退款资格已经批准，但资金尚未退回客户。
            点击下方按钮后会真正向支付平台发起退款。
          </div>

          <button
            type="button"
            onClick={
              handleExecute
            }
            disabled={
              loading
            }
            className="
              mt-4
              rounded-lg
              bg-red-600
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-red-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading
              ? "执行中..."
              : `执行原路退款 ${refund.currency} ${refund.amount.toFixed(
                  2
                )}`}
          </button>
        </div>
      )}

      {refund.status ===
        "processing" && (
        <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
          支付平台正在处理这笔退款。
          暂时不要重复执行，系统将通过后续对账确认最终状态。
        </div>
      )}

      {refund.status ===
        "failed" && (
        <div className="mt-4">
          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">
              上一次退款执行失败
            </p>

            {refund.failureReason && (
              <p className="mt-2 text-sm leading-6 text-red-700">
                {
                  refund.failureReason
                }
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={
              handleExecute
            }
            disabled={
              loading
            }
            className="
              mt-4
              rounded-lg
              border
              border-red-300
              bg-white
              px-4
              py-2.5
              text-sm
              font-medium
              text-red-700
              transition
              hover:bg-red-50
              disabled:opacity-60
            "
          >
            {loading
              ? "重新执行中..."
              : "重新执行退款"}
          </button>
        </div>
      )}

      {refund.status ===
        "succeeded" && (
        <div className="mt-4 rounded-lg bg-green-50 p-4">
          <p className="font-medium text-green-700">
            退款成功
          </p>

          {refund.providerRefundId && (
            <p className="mt-2 break-all text-sm text-green-700">
              Provider Refund ID：
              {
                refund.providerRefundId
              }
            </p>
          )}

          {refund.refundedAt && (
            <p className="mt-2 text-xs text-green-700">
              确认时间：
              {new Date(
                refund.refundedAt
              ).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {refund.status ===
        "rejected" && (
        <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
          退款申请已经被拒绝，不会向支付平台执行退款。
        </div>
      )}
    </section>
  );
}