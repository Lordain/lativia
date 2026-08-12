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

export async function setServiceActive(
  id: string,
  active: boolean
) {
  await requireAdmin();

  const supabase =
    createAdminClient();

  const {
    error,
  } = await supabase
    .from("services")
    .update({
      is_active:
        active,
    })
    .eq(
      "id",
      id
    );

  if (error) {
    console.error(
      "setServiceActive error:",
      error
    );

    throw new Error(
      error.message
    );
  }

  revalidatePath("/");
  revalidatePath(
    "/admin/services"
  );
}