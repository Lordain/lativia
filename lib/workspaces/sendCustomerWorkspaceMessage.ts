"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  createClient,
} from "@/lib/supabase/server";


export async function sendCustomerWorkspaceMessage(
  workspaceId:
    string,
  message:
    string
) {
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
      "请先登录"
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
        order_id,
        user_id,
        status
      `)
      .eq(
        "id",
        cleanWorkspaceId
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
    workspace.status !==
    "active"
  ) {
    throw new Error(
      "当前服务空间已经关闭"
    );
  }


  const {
    error:
      insertError,
  } =
    await supabase
      .from(
        "workspace_messages"
      )
      .insert({
        workspace_id:
          workspace.id,

        order_id:
          workspace.order_id,

        sender_type:
          "customer",

        sender_user_id:
          user.id,

        message:
          cleanMessage,
      });


  if (insertError) {
    console.error(
      "sendCustomerWorkspaceMessage insert error:",
      insertError
    );

    throw new Error(
      "发送消息失败"
    );
  }


  revalidatePath(
    `/account/orders/${workspace.order_id}`
  );

  revalidatePath(
    `/admin/orders/${workspace.order_id}`
  );


  return {
    success:
      true,
  };
}