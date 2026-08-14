"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  createClient,
} from "@/lib/supabase/server";


export async function markAllNotificationsRead() {
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


  const {
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
        "user_id",
        user.id
      )
      .eq(
        "status",
        "unread"
      );


  if (error) {
    console.error(
      "markAllNotificationsRead error:",
      error
    );

    throw new Error(
      "更新通知状态失败"
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