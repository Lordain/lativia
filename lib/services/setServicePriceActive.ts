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

export async function setServicePriceActive(
  serviceId: string,
  priceId: string,
  active: boolean
) {
  await requireAdmin();

  const supabase =
    createAdminClient();

  const {
    error,
  } = await supabase
    .from("service_prices")
    .update({
      active,
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
      "setServicePriceActive error:",
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