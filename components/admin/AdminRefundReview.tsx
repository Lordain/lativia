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
      <section className="overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-violet-100 bg-violet-50/50 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-950">
              退款审核
            </h2>

            <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-600">
              服务无法完成后才可进入退款审核。
              服务一旦成功完成并交付，系统禁止退款。
            </p>
          </div>

          <span
            className={`
              rounded-full
              px-3
              py-1.5
              text-xs
              font-semibold
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

        <div className="p-5 sm:p-6">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-medium text-slate-500">
                退款金额
              </p>

              <p className="mt-1.5 text-lg font-bold text-slate-950">
                {refund.currency}{" "}
                {refund.amount.toFixed(
                  2
                )}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-medium text-slate-500">
                原支付渠道
              </p>

              <p className="mt-1.5 font-semibold text-slate-900">
                {getProviderLabel(
                  refund.provider
                )}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-medium text-slate-500">
                原付款 ID
              </p>

              <p className="mt-1.5 break-all font-mono text-xs text-slate-700">
                {refund.providerPaymentId ??
                  "未记录"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-medium text-slate-500">
                Refund ID
              </p>

              <p className="mt-1.5 break-all font-mono text-xs text-slate-700">
                {refund.id}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-sm font-bold text-slate-900">
              退款审核原因
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {refund.reason}
            </p>
          </div>

          {canReview && (
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
              <label className="text-sm font-bold text-slate-900">
                管理员审核备注
              </label>

              <p className="mt-1 text-xs leading-5 text-slate-500">
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
                className="mt-3 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
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
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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
                  className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ===
                  "reject"
                    ? "处理中..."
                    : "拒绝退款"}
                </button>
              </div>

              <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800">
                批准退款仅代表退款资格审核通过，
                不会立即调用支付平台。
                真正的原路退款需要在下一步「退款执行」中完成。
              </div>
            </div>
          )}

          {!canReview &&
            refund.reviewedAt && (
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-sm font-bold text-slate-900">
                  审核结果
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  状态：
                  {getStatusLabel(
                    refund.status
                  )}
                </p>

                {refund.reviewNote && (
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {refund.reviewNote}
                  </p>
                )}

                <p className="mt-2 text-xs text-slate-400">
                  审核时间：
                  {new Date(
                    refund.reviewedAt
                  ).toLocaleString()}
                </p>
              </div>
            )}

          <div className="mt-6 border-t border-slate-200 pt-5">
            <h3 className="text-sm font-bold text-slate-900">
              退款操作记录
            </h3>

            {activity.length ===
            0 ? (
              <p className="mt-3 text-sm text-slate-500">
                暂无退款操作记录。
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                {activity.map(
                  item => (
                    <div
                      key={
                        item.id
                      }
                      className="rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">
                          {getActivityLabel(
                            item.action
                          )}
                        </p>

                        <p className="text-xs text-slate-400">
                          {new Date(
                            item.createdAt
                          ).toLocaleString()}
                        </p>
                      </div>

                      {item.message && (
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
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
        </div>
      </section>
    );
}
