"use server";

import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import {
  createClient,
} from "@/lib/supabase/server";

import type {
  FulfillmentStatus,
} from "@/types/fulfillment";

export interface TransitionAdminFulfillmentInput {
  fulfillmentId:
    string;

  newStatus:
    FulfillmentStatus;

  message:
    string;

  currentStep:
    string;

  reason:
    string;
}

function getFriendlyError(
  message: string
) {
  if (
    message.includes(
      "COMPLETED_FULFILLMENT_IS_FINAL"
    )
  ) {
    return "此服务已经完成并交付，不能重新处理，也不能进入退款审核。";
  }

  if (
    message.includes(
      "INVALID_FULFILLMENT_TRANSITION"
    )
  ) {
    return "当前办理状态不允许执行这个操作。请刷新页面后重试。";
  }

  if (
    message.includes(
      "HUMAN_REVIEW_REASON_REQUIRED"
    )
  ) {
    return "进入人工审核前必须填写人工审核原因。";
  }

  if (
    message.includes(
      "CUSTOMER_ACTION_REASON_REQUIRED"
    )
  ) {
    return "等待客户操作前必须说明客户需要补充或完成什么。";
  }

  if (
    message.includes(
      "FAILURE_REASON_REQUIRED"
    )
  ) {
    return "标记服务无法完成前必须填写具体原因。";
  }

  if (
    message.includes(
      "SERVICE_NOT_ELIGIBLE_FOR_REFUND_REVIEW"
    )
  ) {
    return "此服务当前不符合进入退款审核的条件。";
  }

  if (
    message.includes(
      "FULFILLMENT_NOT_FOUND"
    )
  ) {
    return "找不到办理任务。";
  }

  return message;
}

export async function transitionAdminFulfillment(
  input:
    TransitionAdminFulfillmentInput
) {
  await requireAdmin();

  const supabase =
    await createClient();

  const {
    data: {
      user,
    },
    error:
      userError,
  } =
    await supabase.auth
      .getUser();

  if (
    userError ||
    !user
  ) {
    throw new Error(
      "管理员登录状态已失效"
    );
  }

  const {
    error,
  } =
    await supabase.rpc(
      "transition_fulfillment_status",
      {
        p_fulfillment_id:
          input
            .fulfillmentId,

        p_new_status:
          input
            .newStatus,

        p_actor_type:
          "admin",

        p_actor_user_id:
          user.id,

        p_message:
          input.message
            .trim() ||
          null,

        p_current_step:
          input
            .currentStep
            .trim() ||
          null,

        p_reason:
          input.reason
            .trim() ||
          null,
      }
    );

  if (error) {
    console.error(
      "transitionAdminFulfillment error:",
      error
    );

    throw new Error(
      getFriendlyError(
        error.message
      )
    );
  }

  return {
    success:
      true,
  };
}