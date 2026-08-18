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
  createOrderNotification,
} from "@/lib/notifications/createOrderNotification";


export async function sendAdminWorkspaceMessage(
  workspaceId:
    string,
  message:
    string
) {
  await requireAdmin();


  const cleanWorkspaceId =
    workspaceId.trim();

  const cleanMessage =
    message.trim();


  if (!cleanWorkspaceId) {
    throw new Error(
      "缺少 Workspace ID"
    );
  }


  if (!cleanMessage) {
    throw new Error(
      "请输入消息内容"
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
      "管理员登录状态已失效"
    );
  }


  const admin =
    createAdminClient();


  const {
    data:
      workspace,

    error:
      workspaceError,
  } =
    await admin
      .from(
        "order_workspaces"
      )
      .select(`
        id,
        order_id,
        status
      `)
      .eq(
        "id",
        cleanWorkspaceId
      )
      .maybeSingle();


  if (
    workspaceError ||
    !workspace
  ) {
    throw new Error(
      "找不到订单服务空间"
    );
  }


  if (
    workspace.status !==
    "active"
  ) {
    throw new Error(
      "当前服务空间已经关闭"
    );
  }


  const {
    data:
      insertedMessage,

    error:
      insertError,
  } =
    await admin
      .from(
        "workspace_messages"
      )
      .insert({
        workspace_id:
          workspace.id,

        order_id:
          workspace.order_id,

        sender_type:
          "admin",

        sender_user_id:
          user.id,

        message:
          cleanMessage,
      })
      .select(`
        id
      `)
      .single();


  if (
    insertError ||
    !insertedMessage
  ) {
    console.error(
      "sendAdminWorkspaceMessage insert error:",
      insertError
    );

    throw new Error(
      "发送服务消息失败"
    );
  }


  /*
   * 普通 Workspace Message
   *
   * 使用独立 Notification Type，
   * 不复用 customer_action_required。
   */

  await createOrderNotification({
    orderId:
      workspace.order_id,

    type:
      "workspace_message",

    title:
      "您的订单有新的服务消息",

    message:
      "服务人员已在订单服务空间发送新的消息，请进入订单查看。",

    idempotencyKey:
      `workspace_message:${insertedMessage.id}`,

    metadata: {
      workspaceId:
        workspace.id,

      workspaceMessageId:
        insertedMessage.id,

      source:
        "workspace_message",
    },
  });


  revalidatePath(
    `/admin/orders/${workspace.order_id}`
  );

  revalidatePath(
    `/account/orders/${workspace.order_id}`
  );


  return {
    success:
      true,
  };
}