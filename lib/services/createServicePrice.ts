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

import type {
  ServicePriceFormData,
} from "@/types/servicePriceAdmin";

export async function createServicePrice(
  serviceId: string,
  input: ServicePriceFormData
) {
  await requireAdmin();

  const amount =
    Number(
      input.amount
    );

  if (
    !Number.isFinite(
      amount
    ) ||
    amount <= 0
  ) {
    throw new Error(
      "请输入有效金额"
    );
  }

  const currency =
    input.currency
      .trim()
      .toUpperCase();

  if (
    !currency
  ) {
    throw new Error(
      "请选择币种"
    );
  }

  if (
    !input.paymentMethod
      .trim()
  ) {
    throw new Error(
      "请选择付款方式"
    );
  }

  const supabase =
    createAdminClient();

  const {
    error,
  } = await supabase
    .from("service_prices")
    .insert({
      service_id:
        serviceId,

      currency,

      amount,

      payment_method:
        input.paymentMethod,

      payment_provider:
        input.paymentProvider ||
        null,

      active:
        input.active,
    });

  if (error) {
    console.error(
      "createServicePrice error:",
      error
    );

    throw new Error(
      error.message
    );
  }

  revalidatePath(
    `/admin/services/${serviceId}`
  );

  revalidatePath(
    "/admin/services"
  );
}