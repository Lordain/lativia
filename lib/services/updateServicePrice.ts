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

export async function updateServicePrice(
  serviceId: string,
  priceId: string,
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

  const supabase =
    createAdminClient();

  const {
    error,
  } = await supabase
    .from("service_prices")
    .update({
      currency:
        input.currency
          .trim()
          .toUpperCase(),

      amount,

      payment_method:
        input.paymentMethod,

      payment_provider:
        input.paymentProvider ||
        null,

      active:
        input.active,
    })
    .eq(
      "id",
      priceId
    )
    .eq(
      "service_id",
      serviceId
    );

  if (error) {
    console.error(
      "updateServicePrice error:",
      error
    );

    throw new Error(
      error.message
    );
  }

  revalidatePath(
    `/admin/services/${serviceId}`
  );
}