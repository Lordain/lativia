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

import {
  serviceSchema,
} from "@/lib/validation/serviceSchema";

import {
  toDatabase,
} from "./toDatabase";

import type {
  ServiceFormData,
} from "@/types/service";

export async function updateService(
  id: string,
  formData: ServiceFormData
) {
  await requireAdmin();

  const validated =
    serviceSchema.parse(
      formData
    );

  const supabase =
    createAdminClient();

  const databaseData =
    toDatabase(
      validated
    );

  const {
    error,
  } = await supabase
    .from("services")
    .update(
      databaseData
    )
    .eq(
      "id",
      id
    );

  if (error) {
    if (
      error.code ===
      "23505"
    ) {
      throw new Error(
        "Slug 已经存在，请使用其他 Slug"
      );
    }

    console.error(
      "updateService error:",
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
  revalidatePath(
    `/admin/services/${id}`
  );
}