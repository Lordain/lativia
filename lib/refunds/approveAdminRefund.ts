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