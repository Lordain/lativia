"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import type {
  Fulfillment,
  FulfillmentStatus,
} from "@/types/fulfillment";

import {
  transitionAdminFulfillment,
} from "@/lib/fulfillments/transitionAdminFulfillment";

import FulfillmentStatusBadge from "@/components/admin/FulfillmentStatusBadge";

interface Props {
  fulfillment:
    Fulfillment | null;

  paymentStatus:
    string;
}

interface ActionDefinition {
  label:
    string;

  status:
    FulfillmentStatus;

  currentStep:
    string;

  defaultMessage:
    string;

  requireReason?:
    boolean;

  reasonPlaceholder?:
    string;

  variant?:
    | "primary"
    | "secondary"
    | "warning"
    | "danger"
    | "success";

  confirmMessage?:
    string;
}

function getActions(
  status:
    FulfillmentStatus
): ActionDefinition[] {
  switch (status) {
    case "queued":
      return [
        {
          label:
            "开始资料检查",

          status:
            "validating",

          currentStep:
            "validate_customer_input",

          defaultMessage:
            "开始检查客户提交资料。",

          variant:
            "primary",
        },

        {
          label:
            "进入人工复核",

          status:
            "manual_review",

          currentStep:
            "manual_review",

          defaultMessage:
            "办理任务进入人工复核。",

          requireReason:
            true,

          reasonPlaceholder:
            "请说明为什么需要人工复核",

          variant:
            "secondary",
        },

        {
          label:
            "标记无法完成",

          status:
            "failed",

          currentStep:
            "fulfillment_failed",

          defaultMessage:
            "确认当前服务无法完成。",

          requireReason:
            true,

          reasonPlaceholder:
            "请说明服务无法完成的具体原因",

          variant:
            "danger",
        },
      ];

    case "validating":
      return [
        {
          label:
            "资料检查完成，开始办理",

          status:
            "processing",

          currentStep:
            "government_processing",

          defaultMessage:
            "资料检查完成，开始办理服务。",

          variant:
            "primary",
        },

        {
          label:
            "需要人工处理",

          status:
            "waiting_human",

          currentStep:
            "government_verification",

          defaultMessage:
            "自动流程需要工作人员介入确认。",

          requireReason:
            true,

          reasonPlaceholder:
            "例如：SAT CAPTCHA 需要人工处理",

          variant:
            "warning",
        },

        {
          label:
            "等待客户补资料",

          status:
            "waiting_customer",

          currentStep:
            "waiting_customer",

          defaultMessage:
            "需要客户补充资料后才能继续办理。",

          requireReason:
            true,

          reasonPlaceholder:
            "请明确客户需要提供什么资料",

          variant:
            "warning",
        },

        {
          label:
            "进入人工复核",

          status:
            "manual_review",

          currentStep:
            "manual_review",

          defaultMessage:
            "资料验证结果需要人工复核。",

          requireReason:
            true,

          reasonPlaceholder:
            "请说明需要人工复核的原因",

          variant:
            "secondary",
        },

        {
          label:
            "标记无法完成",

          status:
            "failed",

          currentStep:
            "fulfillment_failed",

          defaultMessage:
            "确认当前服务无法完成。",

          requireReason:
            true,

          reasonPlaceholder:
            "请说明服务无法完成的具体原因",

          variant:
            "danger",
        },
      ];

    case "processing":
      return [
        {
          label:
            "需要人工处理",

          status:
            "waiting_human",

          currentStep:
            "government_verification",

          defaultMessage:
            "办理过程中需要工作人员人工确认。",

          requireReason:
            true,

          reasonPlaceholder:
            "例如：政府网站 CAPTCHA 或结果需要人工确认",

          variant:
            "warning",
        },

        {
          label:
            "等待客户补资料",

          status:
            "waiting_customer",

          currentStep:
            "waiting_customer",

          defaultMessage:
            "办理过程中需要客户补充资料。",

          requireReason:
            true,

          reasonPlaceholder:
            "请明确客户需要补充什么资料",

          variant:
            "warning",
        },

        {
          label:
            "进入人工复核",

          status:
            "manual_review",

          currentStep:
            "manual_review",

          defaultMessage:
            "当前办理结果需要人工复核。",

          requireReason:
            true,

          reasonPlaceholder:
            "请说明需要人工复核的原因",

          variant:
            "secondary",
        },

        {
          label:
            "确认服务完成",

          status:
            "completed",

          currentStep:
            "result_delivered",

          defaultMessage:
            "办理结果已经确认并完成交付。",

          variant:
            "success",

          confirmMessage:
            "确认服务已经成功完成并交付结果？\n\n完成后此办理任务将成为终止状态，并且不再允许进入退款审核。",
        },

        {
          label:
            "标记无法完成",

          status:
            "failed",

          currentStep:
            "fulfillment_failed",

          defaultMessage:
            "经过处理后确认当前服务无法完成。",

          requireReason:
            true,

          reasonPlaceholder:
            "请填写无法完成的明确原因",

          variant:
            "danger",
        },
      ];

    case "waiting_human":
      return [
        {
          label:
            "人工处理完成，继续办理",

          status:
            "processing",

          currentStep:
            "resume_processing",

          defaultMessage:
            "人工验证完成，继续办理服务。",

          variant:
            "primary",
        },

        {
          label:
            "等待客户补资料",

          status:
            "waiting_customer",

          currentStep:
            "waiting_customer",

          defaultMessage:
            "人工审核后确认需要客户补充资料。",

          requireReason:
            true,

          reasonPlaceholder:
            "请明确客户需要补充的资料",

          variant:
            "warning",
        },

        {
          label:
            "进入人工复核",

          status:
            "manual_review",

          currentStep:
            "manual_review",

          defaultMessage:
            "人工处理后仍需要进一步复核。",

          requireReason:
            true,

          reasonPlaceholder:
            "请说明复核原因",

          variant:
            "secondary",
        },

        {
          label:
            "标记无法完成",

          status:
            "failed",

          currentStep:
            "fulfillment_failed",

          defaultMessage:
            "人工确认后，本次服务无法完成。",

          requireReason:
            true,

          reasonPlaceholder:
            "请填写无法完成的明确原因",

          variant:
            "danger",
        },
      ];

    case "waiting_customer":
      return [
        {
          label:
            "客户资料已补充，重新检查",

          status:
            "validating",

          currentStep:
            "validate_customer_input",

          defaultMessage:
            "客户已经补充资料，重新进行资料检查。",

          variant:
            "primary",
        },

        {
          label:
            "客户资料已确认，继续办理",

          status:
            "processing",

          currentStep:
            "resume_processing",

          defaultMessage:
            "客户所需资料已确认，继续办理。",

          variant:
            "primary",
        },

        {
          label:
            "进入人工复核",

          status:
            "manual_review",

          currentStep:
            "manual_review",

          defaultMessage:
            "客户补充资料后需要人工复核。",

          requireReason:
            true,

          reasonPlaceholder:
            "请填写人工复核原因",

          variant:
            "secondary",
        },

        {
          label:
            "标记无法完成",

          status:
            "failed",

          currentStep:
            "fulfillment_failed",

          defaultMessage:
            "客户资料处理后确认服务无法完成。",

          requireReason:
            true,

          reasonPlaceholder:
            "请填写无法完成原因",

          variant:
            "danger",
        },
      ];

    case "manual_review":
      return [
        {
          label:
            "复核通过，继续办理",

          status:
            "processing",

          currentStep:
            "resume_processing",

          defaultMessage:
            "人工复核完成，继续办理服务。",

          variant:
            "primary",
        },

        {
          label:
            "等待客户补资料",

          status:
            "waiting_customer",

          currentStep:
            "waiting_customer",

          defaultMessage:
            "人工复核后需要客户补充资料。",

          requireReason:
            true,

          reasonPlaceholder:
            "请明确客户需要补充的资料",

          variant:
            "warning",
        },

        {
          label:
            "确认服务完成",

          status:
            "completed",

          currentStep:
            "result_delivered",

          defaultMessage:
            "人工复核确认服务已经完成并交付结果。",

          variant:
            "success",

          confirmMessage:
            "确认服务已经完成并交付？\n\n完成后本服务不再支持退款。",
        },

        {
          label:
            "标记无法完成",

          status:
            "failed",

          currentStep:
            "fulfillment_failed",

          defaultMessage:
            "人工复核确认本次服务无法完成。",

          requireReason:
            true,

          reasonPlaceholder:
            "请填写无法完成的明确原因",

          variant:
            "danger",
        },

        {
          label:
            "进入退款审核",

          status:
            "refund_review",

          currentStep:
            "refund_review",

          defaultMessage:
            "服务未完成，进入退款资格审核。",

          requireReason:
            true,

          reasonPlaceholder:
            "请说明为什么需要进行退款资格审核",

          variant:
            "warning",

          confirmMessage:
            "确认进入退款审核？\n\n这不会立即退款，只会进入退款资格审核流程。",
        },
      ];

    case "failed":
      return [
        {
          label:
            "进入人工复核",

          status:
            "manual_review",

          currentStep:
            "manual_review",

          defaultMessage:
            "服务无法完成，进入人工复核。",

          requireReason:
            true,

          reasonPlaceholder:
            "请填写人工复核原因",

          variant:
            "secondary",
        },

        {
          label:
            "进入退款审核",

          status:
            "refund_review",

          currentStep:
            "refund_review",

          defaultMessage:
            "服务无法完成，进入退款资格审核。",

          requireReason:
            true,

          reasonPlaceholder:
            "请说明服务未完成及进入退款审核的原因",

          variant:
            "warning",

          confirmMessage:
            "确认进入退款审核？\n\n进入退款审核不会立即退款，仍需根据退款政策确认资格。",
        },
      ];

    case "refund_review":
      return [];

    case "completed":
      return [];
  }
}

function getButtonClass(
  variant:
    ActionDefinition["variant"]
) {
  switch (variant) {
    case "success":
      return "bg-green-600 text-white hover:bg-green-700";

    case "danger":
      return "bg-red-600 text-white hover:bg-red-700";

    case "warning":
      return "bg-amber-500 text-white hover:bg-amber-600";

    case "secondary":
      return "border bg-white text-gray-700 hover:bg-gray-50";

    default:
      return "bg-blue-600 text-white hover:bg-blue-700";
  }
}

export default function AdminFulfillmentControl({
  fulfillment,
  paymentStatus,
}: Props) {
  const router =
    useRouter();

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    selectedAction,
    setSelectedAction,
  ] =
    useState<ActionDefinition | null>(
      null
    );

  const [
    reason,
    setReason,
  ] =
    useState("");

  if (!fulfillment) {
    return (
      <section className="mt-8 rounded-xl border bg-white p-6">
        <h2 className="text-xl font-semibold">
          办理执行状态
        </h2>

        {paymentStatus ===
        "paid" ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="font-medium text-red-700">
              付款已经确认，但没有找到办理任务
            </p>

            <p className="mt-1 text-sm leading-6 text-red-600">
              这是需要人工检查的系统异常。
              请不要直接修改订单状态或重复向客户收费。
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
            此订单尚未付款，因此尚未建立办理任务。
          </div>
        )}
      </section>
    );
  }

  const fulfillmentId =
  fulfillment.id;

  const actions =
    getActions(
      fulfillment.status
    );

  async function runAction(
    action:
      ActionDefinition
  ) {
    if (
      action.requireReason &&
      !reason.trim()
    ) {
      alert(
        "请先填写本次操作原因"
      );

      return;
    }

    if (
      action.confirmMessage &&
      !window.confirm(
        action.confirmMessage
      )
    ) {
      return;
    }

    setLoading(
      true
    );

    try {
      await transitionAdminFulfillment(
        {
          fulfillmentId,

          newStatus:
            action.status,

          message:
            action.defaultMessage,

          currentStep:
            action.currentStep,

          reason:
            reason,
        }
      );

      setReason(
        ""
      );

      setSelectedAction(
        null
      );

      router.refresh();
    } catch (error) {
      console.error(
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "办理状态更新失败"
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  return (
    <section className="mt-8 rounded-xl border bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Fulfillment Operations
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            办理执行状态
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            系统优先自动处理正常流程；
            CAPTCHA、资料异常或结果无法确定时，
            再由工作人员介入确认。
          </p>
        </div>

        <FulfillmentStatusBadge
          status={
            fulfillment.status
          }
        />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-500">
            办理模式
          </p>

          <p className="mt-1 font-medium">
            {
              fulfillment
                .fulfillmentType
            }
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-500">
            当前步骤
          </p>

          <p className="mt-1 break-all font-medium">
            {
              fulfillment
                .currentStep ??
              "尚未记录"
            }
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-500">
            开始时间
          </p>

          <p className="mt-1 font-medium">
            {fulfillment
              .startedAt
              ? new Date(
                  fulfillment
                    .startedAt
                ).toLocaleString(
                  "zh-CN"
                )
              : "尚未开始"}
          </p>
        </div>
      </div>

      {fulfillment
        .humanReviewReason && (
        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="font-medium text-amber-800">
            人工审核原因
          </p>

          <p className="mt-1 text-sm leading-6 text-amber-700">
            {
              fulfillment
                .humanReviewReason
            }
          </p>
        </div>
      )}

      {fulfillment
        .customerActionReason && (
        <div className="mt-5 rounded-lg border border-orange-200 bg-orange-50 p-4">
          <p className="font-medium text-orange-800">
            等待客户操作
          </p>

          <p className="mt-1 text-sm leading-6 text-orange-700">
            {
              fulfillment
                .customerActionReason
            }
          </p>
        </div>
      )}

      {fulfillment
        .failureReason && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="font-medium text-red-700">
            无法完成原因
          </p>

          <p className="mt-1 text-sm leading-6 text-red-600">
            {
              fulfillment
                .failureReason
            }
          </p>
        </div>
      )}

      {fulfillment.status ===
        "completed" && (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-5">
          <p className="font-semibold text-green-800">
            服务已经成功完成并交付
          </p>

          <p className="mt-2 text-sm leading-6 text-green-700">
            本服务已经履行完成。
            根据退款规则，已完成并交付的服务不支持退款，
            也不能重新进入办理流程。
          </p>
        </div>
      )}

      {fulfillment.status ===
        "refund_review" && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="font-semibold text-amber-800">
            当前正在进行退款资格审核
          </p>

          <p className="mt-2 text-sm leading-6 text-amber-700">
            进入退款审核并不代表已经退款。
            后续仍需根据服务失败原因、退款政策和付款记录确认资格。
          </p>
        </div>
      )}

      {actions.length >
        0 && (
        <div className="mt-7 border-t pt-6">
          <h3 className="font-semibold">
            可执行操作
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            页面只显示当前状态允许执行的操作，
            数据库状态机仍会进行最终校验。
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {actions.map(
              (
                action
              ) => (
                <button
                  key={`${action.status}-${action.label}`}
                  type="button"
                  disabled={
                    loading
                  }
                  onClick={() => {
                    setSelectedAction(
                      action
                    );

                    if (
                      !action
                        .requireReason
                    ) {
                      void runAction(
                        action
                      );
                    }
                  }}
                  className={`
                    rounded-lg
                    px-4
                    py-2
                    text-sm
                    font-medium
                    transition
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    ${getButtonClass(
                      action.variant
                    )}
                  `}
                >
                  {
                    action.label
                  }
                </button>
              )
            )}
          </div>

          {selectedAction
            ?.requireReason && (
            <div className="mt-5 rounded-xl border bg-gray-50 p-4">
              <label className="block text-sm font-medium">
                操作原因
              </label>

              <textarea
                value={
                  reason
                }
                onChange={(
                  event
                ) =>
                  setReason(
                    event
                      .target
                      .value
                  )
                }
                rows={4}
                placeholder={
                  selectedAction
                    .reasonPlaceholder
                }
                className="mt-2 w-full rounded-lg border bg-white p-3"
              />

              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  disabled={
                    loading
                  }
                  onClick={() =>
                    void runAction(
                      selectedAction
                    )
                  }
                  className={`
                    rounded-lg
                    px-4
                    py-2
                    text-sm
                    font-medium
                    ${getButtonClass(
                      selectedAction
                        .variant
                    )}
                  `}
                >
                  {loading
                    ? "处理中..."
                    : "确认操作"}
                </button>

                <button
                  type="button"
                  disabled={
                    loading
                  }
                  onClick={() => {
                    setSelectedAction(
                      null
                    );

                    setReason(
                      ""
                    );
                  }}
                  className="rounded-lg border bg-white px-4 py-2 text-sm"
                >
                  取消
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}