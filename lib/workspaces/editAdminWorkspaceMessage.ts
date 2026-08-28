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


export async function editAdminWorkspaceMessage(
  messageId:
    string,
  nextMessage:
    string
) {
  await requireAdmin();


  const cleanMessageId =
    messageId.trim();

  const cleanMessage =
    nextMessage.trim();


  if (!cleanMessageId) {
    throw new Error(
      "缺少消息 ID"
    );
  }


  if (!cleanMessage) {
    throw new Error(
      "消息不能为空"
    );
  }


  if (
    cleanMessage.length >
    10000
  ) {
    throw new Error(
      "消息内容过长"
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
        workspace_id,
        order_id,
        sender_type,
        sender_user_id,
        message,
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
   *
   * Admin 只能修改自己发送的 admin message。
   *
   * customer / system 均不可修改。
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
      "您只能编辑自己发送的服务消息"
    );
  }


  if (
    currentMessage
      .deleted_at
  ) {
    throw new Error(
      "已删除的消息不能编辑"
    );
  }


  if (
    currentMessage
      .message ===
      cleanMessage
  ) {
    return {
      success:
        true,
    };
  }


  /*
   * =====================================
   * Revision History
   * =====================================
   */

  const {
    error:
      revisionError,
  } =
    await admin
      .from(
        "workspace_message_revisions"
      )
      .insert({
        message_id:
          currentMessage.id,

        workspace_id:
          currentMessage.workspace_id,

        order_id:
          currentMessage.order_id,

        edited_by:
          user.id,

        editor_type:
          "admin",

        previous_message:
          currentMessage.message,

        new_message:
          cleanMessage,
      });


  if (
    revisionError
  ) {
    console.error(
      "editAdminWorkspaceMessage revision failed"
    );

    throw new Error(
      "保存消息修改记录失败"
    );
  }


  /*
   * =====================================
   * Update Message
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
        message:
          cleanMessage,

        edited_at:
          new Date()
            .toISOString(),
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
      "editAdminWorkspaceMessage update failed"
    );

    throw new Error(
      "编辑消息失败"
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