"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  createClient,
} from "@/lib/supabase/server";


export async function deleteCustomerWorkspaceMessage(
  messageId:
    string
) {
  const cleanMessageId =
    messageId.trim();


  if (!cleanMessageId) {
    throw new Error(
      "缺少消息 ID"
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


  if (
    currentMessage
      .sender_type !==
      "customer" ||
    currentMessage
      .sender_user_id !==
      user.id
  ) {
    throw new Error(
      "您只能删除自己发送的消息"
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


  const {
    error:
      updateError,
  } =
    await supabase
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
      );


  if (updateError) {
    console.error(
      "deleteCustomerWorkspaceMessage error:",
      updateError
    );

    throw new Error(
      "删除消息失败"
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