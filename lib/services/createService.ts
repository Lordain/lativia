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

export async function createService(
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
    data,
    error,
  } = await supabase
    .from("services")
    .insert({
      ...databaseData,

      form_schema:
        [],
    })
    .select("id")
    .single();

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
      "createService error:",
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

  return {
    id:
      data.id,
  };
}