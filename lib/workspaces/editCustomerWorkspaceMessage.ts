"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  createClient,
} from "@/lib/supabase/server";


export async function editCustomerWorkspaceMessage(
  messageId:
    string,
  nextMessage:
    string
) {
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


  const supabase =
    await createClient();


  const {
    data: {
      user,
    },
  } =
    await supabase.auth
      .getUser();


  if (!user) {
    throw new Error(
      "请先登录"
    );
  }


  const {
    data:
      currentMessage,

    error:
      readError,
  } =
    await supabase
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


  if (
    currentMessage
      .sender_type !==
      "customer" ||
    currentMessage
      .sender_user_id !==
      user.id
  ) {
    throw new Error(
      "您只能编辑自己发送的消息"
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


  const {
    error:
      revisionError,
  } =
    await supabase
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
          "customer",

        previous_message:
          currentMessage.message,

        new_message:
          cleanMessage,
      });


  if (revisionError) {
    console.error(
      "editCustomerWorkspaceMessage revision error:",
      revisionError
    );

    throw new Error(
      "保存消息修改记录失败"
    );
  }


  const {
    error:
      updateError,
  } =
    await supabase
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
      );


  if (updateError) {
    console.error(
      "editCustomerWorkspaceMessage update error:",
      updateError
    );

    throw new Error(
      "编辑消息失败"
    );
  }


  revalidatePath(
    `/account/orders/${currentMessage.order_id}`
  );

  revalidatePath(
    `/admin/orders/${currentMessage.order_id}`
  );


  return {
    success:
      true,
  };
}