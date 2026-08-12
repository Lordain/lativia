import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

import type {
  AdminServicePrice,
} from "@/types/servicePriceAdmin";

export async function getAdminServicePrices(
  serviceId: string
): Promise<AdminServicePrice[]> {
  await requireAdmin();

  const supabase =
    createAdminClient();

  const {
    data,
    error,
  } = await supabase
    .from("service_prices")
    .select(`
      id,
      service_id,
      currency,
      amount,
      payment_method,
      payment_provider,
      active,
      created_at
    `)
    .eq(
      "service_id",
      serviceId
    )
    .order(
      "currency"
    )
    .order(
      "payment_provider"
    );

  if (error) {
    console.error(
      "getAdminServicePrices error:",
      error
    );

    throw new Error(
      error.message
    );
  }

  return (
    data ?? []
  ).map(
    (item) => ({
      id:
        item.id,

      serviceId:
        item.service_id,

      currency:
        item.currency,

      amount:
        Number(
          item.amount
        ),

      paymentMethod:
        item.payment_method,

      paymentProvider:
        item.payment_provider,

      active:
        item.active,

      createdAt:
        item.created_at,
    })
  );
}