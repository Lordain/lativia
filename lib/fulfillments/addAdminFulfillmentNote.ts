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

import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

export async function addAdminFulfillmentNote(
  fulfillmentId: string,
  note: string
) {
  /*
   * =====================================
   * 1. Admin 权限检查
   * =====================================
   */

  await requireAdmin();

  const cleanNote =
    note.trim();

  if (!cleanNote) {
    throw new Error(
      "请输入内部备注"
    );
  }

  /*
   * =====================================
   * 2. 获取当前登录 Admin 的 Auth User ID
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
      "无法确认当前管理员身份"
    );
  }

  /*
   * =====================================
   * 3. 使用 Admin Client 读取 Fulfillment
   *
   * 因为 fulfillment 属于内部运营资料，
   * 不依赖普通用户 RLS 权限。
   * =====================================
   */

  const supabaseAdmin =
    createAdminClient();

  const {
    data:
      fulfillment,
    error:
      fulfillmentError,
  } =
    await supabaseAdmin
      .from(
        "fulfillments"
      )
      .select(`
        id,
        order_id
      `)
      .eq(
        "id",
        fulfillmentId
      )
      .maybeSingle();

  if (
    fulfillmentError
  ) {
    console.error(
      "addAdminFulfillmentNote fulfillment error:",
      fulfillmentError
    );

    throw new Error(
      "读取办理任务失败"
    );
  }

  if (!fulfillment) {
    throw new Error(
      "找不到办理任务"
    );
  }

  /*
   * =====================================
   * 4. 写入统一 Fulfillment Activity
   * =====================================
   */

  const {
    error:
      insertError,
  } =
    await supabaseAdmin
      .from(
        "fulfillment_activity"
      )
      .insert({
        fulfillment_id:
          fulfillment.id,

        order_id:
          fulfillment.order_id,

        actor_type:
          "admin",

        actor_user_id:
          user.id,

        action:
          "note_added",

        from_status:
          null,

        to_status:
          null,

        message:
          cleanNote,

        metadata: {
          visibility:
            "internal",
        },
      });

  if (insertError) {
    console.error(
      "addAdminFulfillmentNote insert error:",
      insertError
    );

    throw new Error(
      insertError.message
    );
  }

  /*
   * =====================================
   * 5. Refresh Admin UI
   * =====================================
   */

  revalidatePath(
    `/admin/orders/${fulfillment.order_id}`
  );

  revalidatePath(
    "/admin/orders"
  );

  return {
    success:
      true,
  };
}