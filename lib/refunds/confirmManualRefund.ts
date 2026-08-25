"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  notifyRefundEvent,
} from "@/lib/notifications/notifyRefundEvent";


export async function confirmManualRefund(
  refundId: string,
  orderId: string
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
    await supabase.auth.getUser();


  if (
    userError ||
    !user
  ) {
    throw new Error(
      "无法确认当前管理员身份"
    );
  }


  const admin =
    createAdminClient();


  const {
    error:
      completeError,
  } =
    await admin.rpc(
      "complete_manual_refund",
      {
        p_refund_id:
          refundId,

        p_admin_user_id:
          user.id,
      }
    );


  if (
    completeError
  ) {
    console.error(
      "complete_manual_refund error:",
      completeError
    );


    if (
      completeError.message.includes(
        "MANUAL_REFUND_NOT_APPROVED"
      )
    ) {
      throw new Error(
        "只有已经批准的人工退款才能确认完成。"
      );
    }


    if (
      completeError.message.includes(
        "NOT_MANUAL_WECHAT"
      )
    ) {
      throw new Error(
        "这不是人民币微信人工退款，不能使用人工退款确认。"
      );
    }


    if (
      completeError.message.includes(
        "COMPLETED_SERVICE_CANNOT_BE_REFUNDED"
      )
    ) {
      throw new Error(
        "服务已经完成，系统禁止退款。"
      );
    }


    throw new Error(
      completeError.message
    );
  }


  /*
   * Customer notification.
   *
   * Database state is already committed here.
   * Notification failure must not undo the refund.
   */

  const {
    data:
      refund,
    error:
      refundError,
  } =
    await admin
      .from(
        "refunds"
      )
      .select(`
        id,
        order_id,
        fulfillment_id,
        amount,
        currency
      `)
      .eq(
        "id",
        refundId
      )
      .single();


  if (
    refundError ||
    !refund
  ) {
    console.error(
      "confirmManualRefund notification lookup error:",
      refundError
    );

} else {
    try {
      await notifyRefundEvent({
        refundId:
          refund.id,
  
        orderId:
          refund.order_id,
  
        fulfillmentId:
          refund.fulfillment_id,
  
        event:
          "succeeded",
  
        amount:
          Number(
            refund.amount
          ),
  
        currency:
          refund.currency,
      });
    } catch (
      notificationError
    ) {
      console.error(
        "confirmManualRefund notification error:",
        notificationError
      );
    }
  }

  revalidatePath(
    `/admin/orders/${orderId}`
  );

  revalidatePath(
    "/admin"
  );

  revalidatePath(
    "/admin/operations"
  );


  return {
    status:
      "succeeded" as const,
  };
}