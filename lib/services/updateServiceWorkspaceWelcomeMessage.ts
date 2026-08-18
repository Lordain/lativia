"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import {
  createAdminClient,
} from "@/lib/supabase/admin";


export async function updateServiceWorkspaceWelcomeMessage(
  serviceId:
    string,
  message:
    string
) {
  await requireAdmin();


  const cleanServiceId =
    serviceId.trim();

  const cleanMessage =
    message.trim();


  if (!cleanServiceId) {
    throw new Error(
      "缺少 Service ID"
    );
  }


  if (
    cleanMessage.length >
    10000
  ) {
    throw new Error(
      "欢迎消息不能超过 10000 字符"
    );
  }


  const admin =
    createAdminClient();


  const {
    error,
  } =
    await admin
      .from(
        "services"
      )
      .update({
        workspace_welcome_message:
          cleanMessage ||
          null,
      })
      .eq(
        "id",
        cleanServiceId
      );


  if (error) {
    console.error(
      "updateServiceWorkspaceWelcomeMessage error:",
      error
    );

    throw new Error(
      "保存 Workspace 欢迎消息失败"
    );
  }


  revalidatePath(
    `/admin/services/${cleanServiceId}`
  );


  return {
    success:
      true,
  };
}