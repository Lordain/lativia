"use server";

import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import {
  createClient,
} from "@/lib/supabase/server";

import type {
  OrderResultDeliveryMode,
} from "@/types/result";


export interface DeliverAdminOrderResultInput {
  orderId:
    string;

  title:
    string;

  summary:
    string;

  deliveryMode:
    OrderResultDeliveryMode;
}


function getFriendlyError(
  message:
    string
) {
  if (
    message.includes(
      "ADMIN_REQUIRED"
    )
  ) {
    return "只有管理员可以交付服务结果。";
  }

  if (
    message.includes(
      "RESULT_ALREADY_DELIVERED"
    )
  ) {
    return "此订单的服务结果已经交付，不能再次覆盖。";
  }


  if (
    message.includes(
      "ORDER_NOT_FOUND"
    )
  ) {
    return "找不到对应订单。";
  }


  if (
    message.includes(
      "RESULT_TITLE_REQUIRED"
    )
  ) {
    return "请填写结果标题。";
  }


  if (
    message.includes(
      "RESULT_SUMMARY_REQUIRED"
    )
  ) {
    return "请填写结果说明。";
  }


  if (
    message.includes(
      "INVALID_RESULT_DELIVERY_MODE"
    )
  ) {
    return "结果交付方式无效。";
  }


  return message;
}


export async function deliverAdminOrderResult(
  input:
    DeliverAdminOrderResultInput
) {
  await requireAdmin();


  const cleanOrderId =
    input.orderId.trim();

  const cleanTitle =
    input.title.trim();

  const cleanSummary =
    input.summary.trim();


  if (!cleanOrderId) {
    throw new Error(
      "订单 ID 无效"
    );
  }


  if (!cleanTitle) {
    throw new Error(
      "请填写结果标题"
    );
  }


  if (!cleanSummary) {
    throw new Error(
      "请填写结果说明"
    );
  }


  const supabase =
    await createClient();


  const {
    data:
      resultId,

    error,
  } =
    await supabase.rpc(
      "deliver_order_result",
      {
        p_order_id:
          cleanOrderId,

        p_title:
          cleanTitle,

        p_summary:
          cleanSummary,

        p_delivery_mode:
          input.deliveryMode,

        p_metadata:
          {},
      }
    );


  if (error) {
    console.error(
      "deliverAdminOrderResult error:",
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

    resultId:
      resultId as string,
  };
}