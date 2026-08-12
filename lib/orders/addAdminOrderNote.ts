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

export async function addAdminOrderNote(
  orderId: string,
  note: string
) {
  await requireAdmin();

  const cleanNote =
    note.trim();

  if (!cleanNote) {
    throw new Error(
      "请输入内部备注"
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
      "无法确认当前管理员身份"
    );
  }

  const supabaseAdmin =
    createAdminClient();

  const {
    error,
  } =
    await supabaseAdmin.rpc(
      "admin_add_order_note",
      {
        p_order_id:
          orderId,

        p_actor_user_id:
          user.id,

        p_note:
          cleanNote,
      }
    );

  if (error) {
    console.error(
      "addAdminOrderNote error:",
      error
    );

    throw new Error(
      error.message
    );
  }

  revalidatePath(
    `/admin/orders/${orderId}`
  );

  revalidatePath(
    "/admin/orders"
  );
}