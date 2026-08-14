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
      "bg-gray-100 text-gray-700",

    validating:
      "bg-blue-50 text-blue-700",

    processing:
      "bg-blue-50 text-blue-700",

    waiting_human:
      "bg-amber-50 text-amber-700",

    waiting_customer:
      "bg-amber-50 text-amber-700",

    manual_review:
      "bg-orange-50 text-orange-700",

    completed:
      "bg-green-50 text-green-700",

    failed:
      "bg-red-50 text-red-700",

    refund_review:
      "bg-purple-50 text-purple-700",
  };


function getAvailableActions(
  status:
    FulfillmentStatus
): FulfillmentAction[] {
  switch (
    status
  ) {
    case "queued":
      return [
        {
          status:
            "validating",

          label:
            "开始资料验证",

          description:
            "开始检查客户提交的资料与办理条件。",

          currentStep:
            "validating_application",

          requiresReason:
            false,
        },

        {
          status:
            "manual_review",

          label:
            "进入人工复核",

          description:
            "当前申请需要管理员进一步判断。",

          currentStep:
            "manual_review",

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


    case "validating":
      return [
        {
          status:
            "processing",

          label:
            "开始办理",

          description:
            "资料已经验证，可以开始正式办理。",

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
            "waiting_human",

          label:
            "等待人工处理",

          description:
            "当前步骤需要人工介入。",

          currentStep:
            "waiting_human",

          requiresReason:
            true,
        },

        {
          status:
            "manual_review",

          label:
            "进入人工复核",

          description:
            "需要管理员进一步审核。",

          currentStep:
            "manual_review",

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


    case "processing":
      return [
        {
          status:
            "completed",

          label:
            "确认服务完成",

          description:
            "服务结果已经成功交付给客户。",

          currentStep:
            "service_completed",

          requiresReason:
            false,

          confirmMessage:
            "确定服务已经成功完成并交付吗？完成后的服务不可退款。",
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
            "waiting_human",

          label:
            "等待人工处理",

          description:
            "当前办理步骤需要人工介入。",

          currentStep:
            "waiting_human",

          requiresReason:
            true,
        },

        {
          status:
            "manual_review",

          label:
            "进入人工复核",

          description:
            "当前结果需要管理员审核。",

          currentStep:
            "manual_review",

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


    case "waiting_human":
      return [
        {
          status:
            "processing",

          label:
            "继续办理",

          description:
            "人工处理完成，继续正常办理。",

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
            "下一步需要客户提供资料或操作。",

          currentStep:
            "waiting_customer",

          requiresReason:
            true,
        },

        {
          status:
            "manual_review",

          label:
            "进入人工复核",

          description:
            "需要进一步审核当前情况。",

          currentStep:
            "manual_review",

          requiresReason:
            true,
        },

        {
          status:
            "failed",

          label:
            "标记无法办理",

          description:
            "人工确认服务无法继续完成。",

          currentStep:
            "service_failed",

          requiresReason:
            true,

          confirmMessage:
            "确定当前服务无法完成吗？",
        },
      ];


    case "waiting_customer":
      return [
        {
          status:
            "validating",

          label:
            "重新验证资料",

          description:
            "客户已经补充资料，重新进行验证。",

          currentStep:
            "validating_application",

          requiresReason:
            false,
        },

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
            "manual_review",

          label:
            "进入人工复核",

          description:
            "客户补充内容需要人工确认。",

          currentStep:
            "manual_review",

          requiresReason:
            true,
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


    case "manual_review":
      return [
        {
          status:
            "processing",

          label:
            "继续办理",

          description:
            "人工复核通过，返回正常办理流程。",

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
            "复核后确认还需要客户补充资料。",

          currentStep:
            "waiting_customer",

          requiresReason:
            true,
        },

        {
          status:
            "completed",

          label:
            "确认服务完成",

          description:
            "人工确认服务已经成功完成。",

          currentStep:
            "service_completed",

          requiresReason:
            false,

          confirmMessage:
            "确定服务已经成功完成并交付吗？完成后的服务不可退款。",
        },

        {
          status:
            "failed",

          label:
            "确认无法办理",

          description:
            "人工复核确认服务无法完成。",

          currentStep:
            "service_failed",

          requiresReason:
            true,

          confirmMessage:
            "确定人工复核结果为服务无法完成吗？",
        },

        {
          status:
            "refund_review",

          label:
            "进入退款审核",

          description:
            "确认服务无法完成，并进入退款资格审核。",

          currentStep:
            "refund_review",

          requiresReason:
            true,

          confirmMessage:
            "确定进入退款资格审核吗？只有无法完成且符合退款规则的服务才能退款。",
        },
      ];


    case "failed":
      return [
        {
          status:
            "manual_review",

          label:
            "进入人工复核",

          description:
            "进一步确认失败原因与后续处理方式。",

          currentStep:
            "manual_review",

          requiresReason:
            true,
        },

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
      <section className="mt-8 rounded-xl border bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          Fulfillment Operations
        </p>

        <h2 className="mt-1 text-xl font-semibold">
          办理控制
        </h2>

        {paymentStatus ===
        "unpaid" ? (
          <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm leading-6 text-gray-600">
            当前订单尚未完成付款。
            付款确认后系统会自动建立办理任务。
          </div>
        ) : (
          <div className="mt-4 rounded-lg bg-amber-50 p-4 text-sm leading-6 text-amber-800">
            当前订单没有对应的 Fulfillment 记录，
            请检查付款确认流程。
          </div>
        )}
      </section>
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
    <section className="mt-8 rounded-xl border bg-white p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          Fulfillment Operations
        </p>

        <h2 className="mt-1 text-xl font-semibold">
          办理控制
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          实际业务办理状态统一由 Fulfillment 管理。
          页面只显示当前状态合法的下一步操作。
        </p>
      </div>


      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border p-4">
          <p className="text-xs text-gray-500">
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
                font-medium
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


        <div className="rounded-lg border p-4">
          <p className="text-xs text-gray-500">
            当前步骤
          </p>

          <p className="mt-2 break-words text-sm font-medium text-gray-800">
            {currentFulfillment.currentStep ??
              "尚未记录"}
          </p>
        </div>


        <div className="rounded-lg border p-4">
          <p className="text-xs text-gray-500">
            人工复核
          </p>

          <p className="mt-2 text-sm font-medium text-gray-800">
            {currentFulfillment
              .humanReviewRequired
              ? "需要"
              : "不需要"}
          </p>
        </div>


        <div className="rounded-lg border p-4">
          <p className="text-xs text-gray-500">
            客户操作
          </p>

          <p className="mt-2 text-sm font-medium text-gray-800">
            {currentFulfillment
              .customerActionRequired
              ? "需要"
              : "不需要"}
          </p>
        </div>
      </div>


      {isRefundTerminal && (
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-5">
          <p className="font-medium text-green-800">
            服务流程已结束，退款已经完成
          </p>

          <p className="mt-2 text-sm leading-6 text-green-700">
            该订单已经完成原路退款，
            不再允许重新进入人工复核、
            退款审核或其他办理状态。
          </p>
        </div>
      )}


      {!isRefundTerminal &&
        isCompletedTerminal && (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-5">
            <p className="font-medium text-green-800">
              服务已经成功完成
            </p>

            <p className="mt-2 text-sm leading-6 text-green-700">
              服务已经完成并交付，
              当前状态为业务终态，
              不再允许继续修改办理状态。
            </p>
          </div>
        )}


      {!isRefundTerminal &&
        currentFulfillment
          .humanReviewReason && (
          <div className="mt-6 rounded-lg bg-amber-50 p-4">
            <p className="text-xs font-medium text-amber-700">
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
          <div className="mt-4 rounded-lg bg-amber-50 p-4">
            <p className="text-xs font-medium text-amber-700">
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
        <div className="mt-4 rounded-lg bg-red-50 p-4">
          <p className="text-xs font-medium text-red-700">
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
          <div className="mt-6 rounded-lg border border-purple-200 bg-purple-50 p-5">
            <p className="font-medium text-purple-800">
              已进入退款审核
            </p>

            <p className="mt-2 text-sm leading-6 text-purple-700">
              当前服务已经停止正常办理。
              后续退款资格审核与资金退款，
              请在下方 Refund Management 区域完成。
            </p>
          </div>
        )}


      {!isRefundTerminal &&
        !isCompletedTerminal &&
        currentFulfillment.status !==
          "refund_review" && (
          <div className="mt-6 border-t pt-5">
            <p className="text-sm font-semibold text-gray-800">
              可执行操作
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              页面只显示当前状态允许执行的操作，
              数据库状态机仍会进行最终校验。
            </p>


            {actions.length ===
            0 ? (
              <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                当前没有可执行的下一步操作。
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap gap-3">
                {actions.map(
                  (
                    action
                  ) => {
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
                          rounded-lg
                          border
                          px-4
                          py-2.5
                          text-sm
                          font-medium
                          transition
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                          ${
                            dangerous
                              ? "border-orange-300 bg-white text-orange-700 hover:bg-orange-50"
                              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
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
    </section>
  );
}