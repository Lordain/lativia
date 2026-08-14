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

export async function approveAdminRefund(
  refundId: string,
  orderId: string,
  reviewNote: string
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

  const supabaseAdmin =
    createAdminClient();

  const {
    error,
  } =
    await supabaseAdmin.rpc(
      "approve_refund",
      {
        p_refund_id:
          refundId,

        p_admin_user_id:
          user.id,

        p_review_note:
          reviewNote.trim() ||
          null,
      }
    );

  if (error) {
    console.error(
      "approveAdminRefund error:",
      error
    );

    if (
      error.message.includes(
        "COMPLETED_SERVICE_CANNOT_BE_REFUNDED"
      )
    ) {
      throw new Error(
        "服务已经完成，禁止退款。"
      );
    }

    throw new Error(
      error.message
    );
  }

  /*
 * ========================================
 * Customer Notification
 * ========================================
 */

const {
  data:
    refund,
  error:
    refundError,
} =
  await supabaseAdmin
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
    "approveAdminRefund notification lookup error:",
    refundError
  );

} else {
  await notifyRefundEvent({
    refundId:
      refund.id,

    orderId:
      refund.order_id,

    fulfillmentId:
      refund.fulfillment_id,

    event:
      "approved",

    amount:
      Number(
        refund.amount
      ),

    currency:
      refund.currency,
  });
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
}