"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  transitionAdminFulfillment,
} from "@/lib/fulfillments/transitionAdminFulfillment";

import type {
  Fulfillment,
  FulfillmentStatus,
} from "@/types/fulfillment";

import type {
  PaymentStatus,
} from "@/types/payment";


interface Props {
  fulfillment:
    Fulfillment | null;

  paymentStatus:
    PaymentStatus;
}


interface FulfillmentAction {
  status:
    FulfillmentStatus;

  label:
    string;

  description:
    string;

  currentStep:
    string;

  requiresReason:
    boolean;

  confirmMessage?:
    string;
}


const STATUS_LABELS:
  Record<
    FulfillmentStatus,
    string
  > = {
    queued:
      "等待办理",

    validating:
      "资料验证",

    processing:
      "办理中",

    waiting_human:
      "等待人工处理",

    waiting_customer:
      "等待客户补充",

    manual_review:
      "人工复核",

    completed:
      "服务已完成",

    failed:
      "办理失败",

    refund_review:
      "退款审核",
  };


  const STATUS_STYLES:
  Record<
    FulfillmentStatus,
    string
  > = {
    queued:
      "bg-slate-100 text-slate-700",

    validating:
      "bg-blue-50 text-blue-700",

    processing:
      "bg-blue-50 text-blue-700",

    waiting_human:
      "bg-amber-50 text-amber-700",

    waiting_customer:
      "bg-amber-50 text-amber-700",

    manual_review:
      "bg-amber-50 text-amber-700",

    completed:
      "bg-emerald-50 text-emerald-700",

    failed:
      "bg-red-50 text-red-700",

    refund_review:
      "bg-violet-50 text-violet-700",
  };


  function getAvailableActions(
    status:
      FulfillmentStatus
  ): FulfillmentAction[] {
    switch (
      status
    ) {
      /*
       * 新订单正常入口
       *
       * UI 只显示一个“开始办理”。
       * Server Action 后续负责自动完成：
       * queued -> validating -> processing
       */
      case "queued":
        return [
          {
            status:
              "processing",

            label:
              "开始办理",

            description:
              "开始正式处理本次服务。",

            currentStep:
              "processing",

            requiresReason:
              false,
          },

          {
            status:
              "failed",

            label:
              "标记无法办理",

            description:
              "确认当前服务无法继续完成。",

            currentStep:
              "service_failed",

            requiresReason:
              true,

            confirmMessage:
              "确定将这笔服务标记为无法办理吗？",
          },
        ];


      /*
       * Legacy 状态兼容。
       *
       * 旧订单如果已经停在 validating，
       * 仍然可以继续进入 processing。
       */
      case "validating":
        return [
          {
            status:
              "processing",

            label:
              "继续办理",

            description:
              "继续正式办理本次服务。",

            currentStep:
              "processing",

            requiresReason:
              false,
          },

          {
            status:
              "waiting_customer",

            label:
              "等待客户补充",

            description:
              "需要客户补充资料或完成其他操作。",

            currentStep:
              "waiting_customer",

            requiresReason:
              true,
          },

          {
            status:
              "failed",

            label:
              "标记无法办理",

            description:
              "确认当前服务无法继续完成。",

            currentStep:
              "service_failed",

            requiresReason:
              true,

            confirmMessage:
              "确定将这笔服务标记为无法办理吗？",
          },
        ];


      /*
       * 正常办理主状态
       */
      case "processing":
        return [
          {
            status:
              "completed",

            label:
              "确认服务完成",

            description:
              "确认本次服务已经完成。",

            currentStep:
              "service_completed",

            requiresReason:
              false,

            confirmMessage:
              "确定本次服务已经完成吗？",
          },

          {
            status:
              "waiting_customer",

            label:
              "等待客户补充",

            description:
              "客户需要补充资料或完成其他操作。",

            currentStep:
              "waiting_customer",

            requiresReason:
              true,
          },

          {
            status:
              "failed",

            label:
              "标记无法办理",

            description:
              "服务因客观原因无法完成。",

            currentStep:
              "service_failed",

            requiresReason:
              true,

            confirmMessage:
              "确定当前服务无法完成吗？",
          },
        ];


      /*
       * 客户完成补充以后直接恢复办理。
       *
       * 不再强制重新走 validating。
       */
      case "waiting_customer":
        return [
          {
            status:
              "processing",

            label:
              "继续办理",

            description:
              "客户所需操作已经完成，可以继续办理。",

            currentStep:
              "processing",

            requiresReason:
              false,
          },

          {
            status:
              "failed",

            label:
              "标记无法办理",

            description:
              "确认服务已无法继续。",

            currentStep:
              "service_failed",

            requiresReason:
              true,

            confirmMessage:
              "确定当前服务无法完成吗？",
          },
        ];


      /*
       * Legacy 状态。
       *
       * 不再允许新的正常订单进入这些状态，
       * 但旧订单如果已经在这里，仍然可以恢复。
       */
      case "waiting_human":
      case "manual_review":
        return [
          {
            status:
              "processing",

            label:
              "继续办理",

            description:
              "恢复正常办理流程。",

            currentStep:
              "processing",

            requiresReason:
              false,
          },

          {
            status:
              "waiting_customer",

            label:
              "等待客户补充",

            description:
              "需要客户补充资料或完成其他操作。",

            currentStep:
              "waiting_customer",

            requiresReason:
              true,
          },

          {
            status:
              "failed",

            label:
              "标记无法办理",

            description:
              "确认服务无法继续完成。",

            currentStep:
              "service_failed",

            requiresReason:
              true,

            confirmMessage:
              "确定当前服务无法完成吗？",
          },
        ];


      /*
       * 服务无法完成以后，
       * 仍保留退款审核入口。
       */
      case "failed":
        return [
          {
            status:
              "refund_review",

            label:
              "进入退款审核",

            description:
              "服务无法完成，进入退款资格审核流程。",

            currentStep:
              "refund_review",

            requiresReason:
              true,

            confirmMessage:
              "确定进入退款资格审核吗？",
          },
        ];


      case "refund_review":
      case "completed":
      default:
        return [];
    }
  }


export default function AdminFulfillmentControl({
  fulfillment,
  paymentStatus,
}: Props) {
  const router =
    useRouter();


  const [
    loadingStatus,
    setLoadingStatus,
  ] =
    useState<
      FulfillmentStatus | null
    >(
      null
    );


  /*
   * ========================================
   * No Fulfillment
   * ========================================
   */

  if (!fulfillment) {
    return (
      <div>
        <div>
          <h3 className="font-bold text-slate-950">
            办理控制
          </h3>

          <p className="mt-1.5 text-sm leading-6 text-slate-500">
            实际业务办理状态由 Fulfillment 统一管理。
          </p>
        </div>

        {paymentStatus ===
        "unpaid" ? (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            当前订单尚未完成付款。
            付款确认后系统会自动建立办理任务。
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
            当前订单没有对应的 Fulfillment 记录，
            请检查付款确认流程。
          </div>
        )}
      </div>
    );
  }


  /*
   * ========================================
   * Fulfillment guaranteed non-null
   * ========================================
   */

  const currentFulfillment =
    fulfillment;


  /*
   * ========================================
   * Refund Terminal State
   * ========================================
   */

  const isRefundTerminal =
    paymentStatus ===
      "refunded" ||
    currentFulfillment.currentStep ===
      "refund_succeeded";


  /*
   * ========================================
   * Completed Terminal State
   * ========================================
   */

  const isCompletedTerminal =
    currentFulfillment.status ===
    "completed";


  const actions =
    isRefundTerminal ||
    isCompletedTerminal
      ? []
      : getAvailableActions(
          currentFulfillment.status
        );


  async function handleAction(
    action:
      FulfillmentAction
  ) {
    if (
      loadingStatus ||
      isRefundTerminal ||
      isCompletedTerminal
    ) {
      return;
    }


    if (
      action.confirmMessage
    ) {
      const confirmed =
        window.confirm(
          action.confirmMessage
        );


      if (!confirmed) {
        return;
      }
    }


    let reason =
      "";


    if (
      action.requiresReason
    ) {
      const input =
        window.prompt(
          "请输入处理原因："
        );


      if (
        input === null
      ) {
        return;
      }


      const cleanReason =
        input.trim();


      if (!cleanReason) {
        alert(
          "此操作必须填写原因。"
        );

        return;
      }


      reason =
        cleanReason;
    }


    setLoadingStatus(
      action.status
    );


    try {
      await transitionAdminFulfillment(
        {
          fulfillmentId:
            currentFulfillment.id,

          newStatus:
            action.status,

          message:
            action.description,

          currentStep:
            action.currentStep,

          reason,
        }
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
          : "更新办理状态失败"
      );

    } finally {
      setLoadingStatus(
        null
      );
    }
  }


  return (
    <div>
      <div>
        <h3 className="font-bold text-slate-950">
          办理控制
        </h3>

        <p className="mt-1.5 text-sm leading-6 text-slate-500">
          实际业务办理状态统一由 Fulfillment 管理。
          页面只显示当前状态允许执行的下一步操作。
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <p className="text-xs font-medium text-slate-500">
            当前状态
          </p>

          <div className="mt-2">
            <span
              className={`
                inline-flex
                rounded-full
                px-2.5
                py-1
                text-xs
                font-semibold
                ${
                  STATUS_STYLES[
                    currentFulfillment.status
                  ]
                }
              `}
            >
              {
                STATUS_LABELS[
                  currentFulfillment.status
                ]
              }
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <p className="text-xs font-medium text-slate-500">
            当前步骤
          </p>

          <p className="mt-2 break-words text-sm font-semibold text-slate-900">
            {currentFulfillment.currentStep ??
              "尚未记录"}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <p className="text-xs font-medium text-slate-500">
            客户操作
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-900">
            {currentFulfillment
              .customerActionRequired
              ? "需要"
              : "不需要"}
          </p>
        </div>
      </div>

      {isRefundTerminal && (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="font-semibold text-emerald-800">
            服务流程已结束，退款已经完成
          </p>

          <p className="mt-2 text-sm leading-6 text-emerald-700">
            该订单已经完成原路退款，
            不再允许重新进入人工复核、
            退款审核或其他办理状态。
          </p>
        </div>
      )}

      {!isRefundTerminal &&
        isCompletedTerminal && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="font-semibold text-emerald-800">
              服务已经成功完成
            </p>

            <p className="mt-2 text-sm leading-6 text-emerald-700">
              服务已经完成并交付，
              当前状态为业务终态，
              不再允许继续修改办理状态。
            </p>
          </div>
        )}

      {!isRefundTerminal &&
        currentFulfillment
          .humanReviewReason && (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-semibold text-amber-700">
              人工处理原因
            </p>

            <p className="mt-2 text-sm leading-6 text-amber-800">
              {
                currentFulfillment
                  .humanReviewReason
              }
            </p>
          </div>
        )}

      {!isRefundTerminal &&
        currentFulfillment
          .customerActionReason && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-semibold text-amber-700">
              等待客户原因
            </p>

            <p className="mt-2 text-sm leading-6 text-amber-800">
              {
                currentFulfillment
                  .customerActionReason
              }
            </p>
          </div>
        )}

      {currentFulfillment
        .failureReason && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-xs font-semibold text-red-700">
            无法完成原因
          </p>

          <p className="mt-2 text-sm leading-6 text-red-700">
            {
              currentFulfillment
                .failureReason
            }
          </p>
        </div>
      )}

      {!isRefundTerminal &&
        currentFulfillment.status ===
          "refund_review" && (
          <div className="mt-5 rounded-xl border border-violet-200 bg-violet-50 p-4">
            <p className="font-semibold text-violet-800">
              已进入退款审核
            </p>

            <p className="mt-2 text-sm leading-6 text-violet-700">
              当前服务已经停止正常办理。
              后续退款资格审核与资金退款，
              请在下方退款管理区域完成。
            </p>
          </div>
        )}

      {!isRefundTerminal &&
        !isCompletedTerminal &&
        currentFulfillment.status !==
          "refund_review" && (
          <div className="mt-6 border-t border-slate-200 pt-5">
            <p className="text-sm font-bold text-slate-900">
              可执行操作
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              页面只显示当前状态允许执行的操作，
              数据库状态机仍会进行最终校验。
            </p>

            {actions.length ===
            0 ? (
              <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                当前没有可执行的下一步操作。
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap gap-3">
                {actions.map(
                  action => {
                    const loading =
                      loadingStatus ===
                      action.status;


                    const dangerous =
                      action.status ===
                        "failed" ||
                      action.status ===
                        "refund_review";


                    return (
                      <button
                        key={
                          action.status
                        }
                        type="button"
                        onClick={() =>
                          handleAction(
                            action
                          )
                        }
                        disabled={
                          loadingStatus !==
                          null
                        }
                        className={`
                          rounded-xl
                          border
                          px-4
                          py-2.5
                          text-sm
                          font-semibold
                          transition
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                          ${
                            dangerous
                              ? "border-red-200 bg-white text-red-700 hover:bg-red-50"
                              : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          }
                        `}
                      >
                        {loading
                          ? "处理中..."
                          : action.label}
                      </button>
                    );
                  }
                )}
              </div>
            )}
          </div>
        )}
    </div>
  );
}
