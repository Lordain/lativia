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

import {
  notifyOrderResultDelivered,
} from "@/lib/notifications/notifyOrderResultDelivered";


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


  const cleanResultId =
  resultId as string;


/*
 * =========================================
 * Result Delivered Notification
 * =========================================
 *
 * Result delivery is the primary operation.
 *
 * Notification / Email are secondary
 * side effects and must never roll back
 * a successfully delivered Result.
 */

try {
  const {
    data:
      deliveredResult,

    error:
      resultLookupError,
  } =
    await supabase
      .from(
        "order_results"
      )
      .select(`
        id,
        result_is_official
      `)
      .eq(
        "id",
        cleanResultId
      )
      .single();


  const resultRow =
    deliveredResult;


  if (
    resultLookupError ||
    !resultRow
  ) {
    console.error(
      "deliverAdminOrderResult notification result lookup error:",
      {
        orderId:
          cleanOrderId,

        resultId:
          cleanResultId,

        error:
          resultLookupError,
      }
    );

  } else {
    const confirmedResult =
      resultRow!;
  
  
    await notifyOrderResultDelivered({
      orderId:
        cleanOrderId,
  
      resultId:
        cleanResultId,
  
      resultIsOfficial:
        Boolean(
          confirmedResult
            .result_is_official
        ),
    });
  }

} catch (
  notificationError
) {
  console.error(
    "deliverAdminOrderResult notification side effect error:",
    {
      orderId:
        cleanOrderId,

      resultId:
        cleanResultId,

      error:
        notificationError,
    }
  );
}


return {
  success:
    true,

  resultId:
    cleanResultId,
};
}