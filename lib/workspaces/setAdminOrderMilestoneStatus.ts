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


export async function setAdminOrderMilestoneStatus(
  milestoneId: string,
  orderId: string,
  completed: boolean
) {
  const profile =
    await requireAdmin();


  const cleanMilestoneId =
    milestoneId.trim();

  const cleanOrderId =
    orderId.trim();


  if (
    !cleanMilestoneId ||
    !cleanOrderId
  ) {
    throw new Error(
      "Milestone 参数无效"
    );
  }


  const admin =
    createAdminClient();


  const {
    error,
  } =
    await admin.rpc(
      "set_order_milestone_status",
      {
        p_milestone_id:
          cleanMilestoneId,

        p_admin_user_id:
          profile.id,

        p_completed:
          completed,
      }
    );


  if (error) {
    console.error(
      "set_order_milestone_status error:",
      error
    );


    if (
      error.message.includes(
        "WORKSPACE_NOT_ACTIVE"
      )
    ) {
      throw new Error(
        "当前客户服务空间不是进行中状态，无法修改服务进度。"
      );
    }


    throw new Error(
      error.message
    );
  }


  revalidatePath(
    `/admin/orders/${cleanOrderId}`
  );

  revalidatePath(
    `/account/orders/${cleanOrderId}`
  );


  return {
    success:
      true,
  };
}