"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  createAdminClient,
} from "@/lib/supabase/admin";


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
        workspace_id,
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

  const {
    data:
      workspace,

    error:
      workspaceError,
  } =
    await supabase
      .from(
        "order_workspaces"
      )
      .select(`
        id,
        status
      `)
      .eq(
        "id",
        currentMessage.workspace_id
      )
      .eq(
        "user_id",
        user.id
      )
      .maybeSingle();


  if (
    workspaceError ||
    !workspace
  ) {
    throw new Error(
      "找不到您的订单服务空间"
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


if (
  workspace.status !==
    "active"
) {
  throw new Error(
    "当前服务空间已经关闭"
  );
}

  const admin =
    createAdminClient();

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
        "customer"
      )
      .eq(
        "sender_user_id",
        user.id
      )
      .is(
        "deleted_at",
        null
      );


  if (updateError) {
    console.error(
      "deleteCustomerWorkspaceMessage failed"
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