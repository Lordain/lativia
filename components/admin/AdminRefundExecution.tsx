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

import {
  confirmManualRefund,
} from "@/lib/refunds/confirmManualRefund";

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


  const isManualRefund =
    refund.provider ===
      null;


  const canExecuteAutomatic =
    !isManualRefund &&
    (
      refund.status ===
        "approved" ||
      refund.status ===
        "failed"
    );


  if (
    refund.status ===
    "pending_review"
  ) {
    return null;
  }


  async function handleExecuteAutomatic() {
    if (
      loading ||
      !canExecuteAutomatic
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


  async function handleConfirmManual() {
    if (
      loading ||
      !isManualRefund ||
      refund.status !==
        "approved"
    ) {
      return;
    }


    const confirmed =
      window.confirm(
        `请确认您已经实际向客户退回 ${refund.currency} ${refund.amount.toFixed(
          2
        )}。\n\n此按钮不会执行微信转账，只会把系统中的退款记录标记为已经完成。\n\n只有在资金已经实际退回客户后才能确认。`
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
      await confirmManualRefund(
        refund.id,
        refund.orderId
      );


      alert(
        "人工退款已经确认完成。"
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
          : "确认人工退款失败"
      );


      router.refresh();

    } finally {
      setLoading(
        false
      );
    }
  }


  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <h3 className="text-lg font-bold text-slate-950">
          退款执行
        </h3>


        <p className="mt-1.5 text-sm leading-6 text-slate-500">
          {isManualRefund
            ? "人民币微信付款采用人工退款。管理员必须先实际退回资金，再在系统中确认退款完成。"
            : "退款按照原付款渠道原路退回。Stripe 订单由 Stripe 执行，Mercado Pago 订单由 Mercado Pago 执行。"}
        </p>
      </div>


      <div className="p-5 sm:p-6">
        {refund.status ===
          "approved" && (
          <div>
            {isManualRefund ? (
              <>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                  退款资格已经批准。
                  系统不会自动操作客户资金，也不会自动执行微信转账。
                  请先通过实际收款渠道完成退款，
                  确认客户资金已经退回后，再点击下方按钮。
                </div>


                <button
                  type="button"
                  onClick={
                    handleConfirmManual
                  }
                  disabled={
                    loading
                  }
                  className="mt-4 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "确认中..."
                    : `确认已完成人工退款 ${refund.currency} ${refund.amount.toFixed(
                        2
                      )}`}
                </button>
              </>
            ) : (
              <>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                  退款资格已经批准，但资金尚未退回客户。
                  点击下方按钮后会真正向支付平台发起退款。
                </div>


                <button
                  type="button"
                  onClick={
                    handleExecuteAutomatic
                  }
                  disabled={
                    loading
                  }
                  className="mt-4 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "执行中..."
                    : `执行原路退款 ${refund.currency} ${refund.amount.toFixed(
                        2
                      )}`}
                </button>
              </>
            )}
          </div>
        )}


        {refund.status ===
          "processing" && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800">
            支付平台正在处理这笔退款。
            暂时不要重复执行，系统将通过后续对账确认最终状态。
          </div>
        )}


        {refund.status ===
          "failed" && (
          <div>
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">
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


            {!isManualRefund && (
              <button
                type="button"
                onClick={
                  handleExecuteAutomatic
                }
                disabled={
                  loading
                }
                className="mt-4 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
              >
                {loading
                  ? "重新执行中..."
                  : "重新执行退款"}
              </button>
            )}
          </div>
        )}


        {refund.status ===
          "succeeded" && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="font-semibold text-emerald-700">
              {isManualRefund
                ? "人工退款已完成"
                : "退款成功"}
            </p>


            {refund.providerRefundId && (
              <p className="mt-2 break-all text-sm text-emerald-700">
                Provider Refund ID：
                {
                  refund.providerRefundId
                }
              </p>
            )}


            {refund.refundedAt && (
              <p className="mt-2 text-xs text-emerald-700">
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
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            退款申请已经被拒绝，不会执行退款。
          </div>
        )}
      </div>
    </section>
  );
}