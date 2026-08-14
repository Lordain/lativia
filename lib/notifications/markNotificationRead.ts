"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  createClient,
} from "@/lib/supabase/server";


export async function markNotificationRead(
  notificationId:
    string
) {
  const cleanId =
    notificationId.trim();


  if (!cleanId) {
    throw new Error(
      "NOTIFICATION_ID_REQUIRED"
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
      "请先登录"
    );
  }


  /*
   * RLS 会保证：
   *
   * auth.uid() = notifications.user_id
   */

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "notifications"
      )
      .update({
        status:
          "read",

        read_at:
          new Date()
            .toISOString(),
      })
      .eq(
        "id",
        cleanId
      )
      .eq(
        "user_id",
        user.id
      )
      .select(
        "id"
      )
      .maybeSingle();


  if (error) {
    console.error(
      "markNotificationRead error:",
      error
    );


    throw new Error(
      "更新通知状态失败"
    );
  }


  if (!data) {
    throw new Error(
      "找不到通知或无权操作"
    );
  }


  revalidatePath(
    "/account/notifications"
  );


  return {
    success:
      true,
  };
}