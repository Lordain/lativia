"use server";

import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import {
  createAdminClient,
} from "@/lib/supabase/admin";


export async function deleteService(
  id: string
) {
  await requireAdmin();


  const cleanId =
    id.trim();


  if (!cleanId) {
    throw new Error(
      "缺少服务 ID"
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
      .delete()
      .eq(
        "id",
        cleanId
      );


  if (error) {
    console.error(
      "deleteService error:",
      error
    );

    throw new Error(
      "删除服务失败"
    );
  }
}