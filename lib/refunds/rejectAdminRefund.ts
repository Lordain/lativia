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

export async function rejectAdminRefund(
  refundId: string,
  orderId: string,
  reviewNote: string
) {
  await requireAdmin();

  const cleanNote =
    reviewNote.trim();

  if (!cleanNote) {
    throw new Error(
      "拒绝退款时必须填写原因"
    );
  }

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
      "reject_refund",
      {
        p_refund_id:
          refundId,

        p_admin_user_id:
          user.id,

        p_review_note:
          cleanNote,
      }
    );

  if (error) {
    console.error(
      "rejectAdminRefund error:",
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