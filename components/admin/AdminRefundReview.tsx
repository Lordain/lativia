"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  approveAdminRefund,
} from "@/lib/refunds/approveAdminRefund";

import {
  rejectAdminRefund,
} from "@/lib/refunds/rejectAdminRefund";

import type {
  Refund,
  RefundActivity,
  RefundStatus,
} from "@/types/refund";

interface Props {
  refund: Refund;

  activity:
    RefundActivity[];
}

function getStatusLabel(
  status:
    RefundStatus
) {
  switch (status) {
    case "pending_review":
      return "等待审核";

    case "approved":
      return "已批准，等待执行";

    case "rejected":
      return "已拒绝";

    case "processing":
      return "退款处理中";

    case "succeeded":
      return "退款成功";

    case "failed":
      return "退款执行失败";
  }
}

function getStatusClass(
  status:
    RefundStatus
) {
  switch (status) {
    case "pending_review":
      return "bg-amber-100 text-amber-700";

    case "approved":
      return "bg-blue-100 text-blue-700";

    case "rejected":
      return "bg-gray-100 text-gray-700";

    case "processing":
      return "bg-blue-100 text-blue-700";

    case "succeeded":
      return "bg-green-100 text-green-700";

    case "failed":
      return "bg-red-100 text-red-700";
  }
}

function getProviderLabel(
  provider:
    Refund["provider"]
) {
  switch (provider) {
    case "stripe":
      return "Stripe";

    case "mercado_pago":
      return "Mercado Pago";

    case "nuvei":
      return "Nuvei";
  }
}

function getActivityLabel(
  action: string
) {
  switch (action) {
    case "refund_case_created":
      return "建立退款审核";

    case "refund_approved":
      return "批准退款";

    case "refund_rejected":
      return "拒绝退款";

    case "refund_execution_started":
      return "开始执行退款";

    case "refund_succeeded":
      return "退款成功";

    case "refund_failed":
      return "退款失败";

    case "refund_retry_started":
      return "重新执行退款";

    default:
      return action;
  }
}

export default function AdminRefundReview({
  refund,
  activity,
}: Props) {
  const router =
    useRouter();

  const [
    reviewNote,
    setReviewNote,
  ] =
    useState(
      ""
    );

  const [
    loading,
    setLoading,
  ] =
    useState<
      "approve" |
      "reject" |
      null
    >(
      null
    );

  async function handleApprove() {
    if (
      loading
    ) {
      return;
    }

    setLoading(
      "approve"
    );

    try {
      await approveAdminRefund(
        refund.id,
        refund.orderId,
        reviewNote
      );

      setReviewNote(
        ""
      );

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
          : "批准退款失败"
      );
    } finally {
      setLoading(
        null
      );
    }
  }

  async function handleReject() {
    if (
      loading
    ) {
      return;
    }

    if (
      !reviewNote.trim()
    ) {
      alert(
        "拒绝退款时必须填写原因"
      );

      return;
    }

    setLoading(
      "reject"
    );

    try {
      await rejectAdminRefund(
        refund.id,
        refund.orderId,
        reviewNote
      );

      setReviewNote(
        ""
      );

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
          : "拒绝退款失败"
      );
    } finally {
      setLoading(
        null
      );
    }
  }

  const canReview =
    refund.status ===
    "pending_review";

  return (
    <section className="mt-8 rounded-xl border border-orange-200 bg-orange-50/40 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
            Refund Management
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            退款审核
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
            服务无法完成后才可进入退款审核。
            服务一旦成功完成并交付，系统禁止退款。
          </p>
        </div>

        <span
          className={`
            rounded-full
            px-3
            py-1.5
            text-sm
            font-medium
            ${getStatusClass(
              refund.status
            )}
          `}
        >
          {getStatusLabel(
            refund.status
          )}
        </span>
      </div>

      {/* Refund Summary */}

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-xs text-gray-500">
            退款金额
          </p>

          <p className="mt-1 text-lg font-semibold">
            {refund.currency}{" "}
            {refund.amount.toFixed(
              2
            )}
          </p>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <p className="text-xs text-gray-500">
            原支付渠道
          </p>

          <p className="mt-1 text-lg font-semibold">
            {getProviderLabel(
              refund.provider
            )}
          </p>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <p className="text-xs text-gray-500">
            原付款 ID
          </p>

          <p className="mt-1 break-all text-sm font-medium">
            {refund.providerPaymentId ??
              "未记录"}
          </p>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <p className="text-xs text-gray-500">
            Refund ID
          </p>

          <p className="mt-1 break-all text-sm font-medium">
            {refund.id}
          </p>
        </div>
      </div>

      {/* Failure / Refund Reason */}

      <div className="mt-5 rounded-lg border bg-white p-5">
        <p className="text-sm font-semibold">
          退款审核原因
        </p>

        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
          {refund.reason}
        </p>
      </div>

      {/* Review */}

      {canReview && (
        <div className="mt-5 rounded-lg border bg-white p-5">
          <label className="text-sm font-semibold">
            管理员审核备注
          </label>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            批准退款时备注可选；
            拒绝退款时必须填写明确原因。
          </p>

          <textarea
            rows={
              4
            }
            value={
              reviewNote
            }
            onChange={(
              event
            ) =>
              setReviewNote(
                event.target.value
              )
            }
            placeholder="填写审核依据、客户情况或拒绝退款原因..."
            className="mt-3 w-full rounded-lg border bg-white p-3"
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={
                handleApprove
              }
              disabled={
                loading !==
                null
              }
              className="
                rounded-lg
                bg-blue-600
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ===
              "approve"
                ? "处理中..."
                : "批准退款"}
            </button>

            <button
              type="button"
              onClick={
                handleReject
              }
              disabled={
                loading !==
                null
              }
              className="
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
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ===
              "reject"
                ? "处理中..."
                : "拒绝退款"}
            </button>
          </div>

          <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm leading-6 text-blue-800">
            “批准退款”目前只代表退款资格审核通过，
            不会立即调用支付平台。真正的 Stripe /
            Mercado Pago 原路退款将在下一阶段执行。
          </div>
        </div>
      )}

      {/* Review Result */}

      {!canReview &&
        refund.reviewedAt && (
          <div className="mt-5 rounded-lg border bg-white p-5">
            <p className="text-sm font-semibold">
              审核结果
            </p>

            <p className="mt-2 text-sm text-gray-600">
              状态：
              {getStatusLabel(
                refund.status
              )}
            </p>

            {refund.reviewNote && (
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                {refund.reviewNote}
              </p>
            )}

            <p className="mt-2 text-xs text-gray-400">
              审核时间：
              {new Date(
                refund.reviewedAt
              ).toLocaleString()}
            </p>
          </div>
        )}

      {/* Refund Activity */}

      <div className="mt-6">
        <h3 className="text-sm font-semibold">
          退款操作记录
        </h3>

        {activity.length ===
        0 ? (
          <p className="mt-3 text-sm text-gray-500">
            暂无退款操作记录。
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {activity.map(
              (
                item
              ) => (
                <div
                  key={
                    item.id
                  }
                  className="rounded-lg border bg-white p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium">
                      {getActivityLabel(
                        item.action
                      )}
                    </p>

                    <p className="text-xs text-gray-400">
                      {new Date(
                        item.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  {item.message && (
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                      {
                        item.message
                      }
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}