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


export async function deleteAdminWorkspaceMessage(
  messageId:
    string
) {
  await requireAdmin();


  const cleanMessageId =
    messageId.trim();


  if (!cleanMessageId) {
    throw new Error(
      "缺少消息 ID"
    );
  }


  /*
   * =====================================
   * Current Admin User
   * =====================================
   */

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


  /*
   * =====================================
   * Read Message
   * =====================================
   */

  const admin =
    createAdminClient();


  const {
    data:
      currentMessage,

    error:
      readError,
  } =
    await admin
      .from(
        "workspace_messages"
      )
      .select(`
        id,
        order_id,
        sender_type,
        sender_user_id,
        deleted_at
      `)
      .eq(
        "id",
        cleanMessageId
      )
      .maybeSingle();


  if (
    readError ||
    !currentMessage
  ) {
    throw new Error(
      "找不到消息"
    );
  }


  /*
   * =====================================
   * Ownership
   * =====================================
   */

  if (
    currentMessage
      .sender_type !==
      "admin" ||
    currentMessage
      .sender_user_id !==
      user.id
  ) {
    throw new Error(
      "您只能删除自己发送的服务消息"
    );
  }


  if (
    currentMessage
      .deleted_at
  ) {
    return {
      success:
        true,
    };
  }


  /*
   * =====================================
   * Soft Delete
   * =====================================
   */

  const {
    error:
      updateError,
  } =
    await admin
      .from(
        "workspace_messages"
      )
      .update({
        deleted_at:
          new Date()
            .toISOString(),

        deleted_by:
          user.id,
      })
      .eq(
        "id",
        currentMessage.id
      )
      .eq(
        "sender_type",
        "admin"
      )
      .eq(
        "sender_user_id",
        user.id
      )
      .is(
        "deleted_at",
        null
      );


  if (
    updateError
  ) {
    console.error(
      "deleteAdminWorkspaceMessage error:",
      updateError
    );

    throw new Error(
      "删除消息失败"
    );
  }


  /*
   * =====================================
   * Revalidate
   * =====================================
   */

  revalidatePath(
    `/admin/orders/${currentMessage.order_id}`
  );

  revalidatePath(
    `/account/orders/${currentMessage.order_id}`
  );


  return {
    success:
      true,
  };
}