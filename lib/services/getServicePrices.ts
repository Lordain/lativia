import {
  createClient,
} from "@/lib/supabase/server";

import type {
  Currency,
  PaymentMethod,
  PaymentProvider,
} from "@/types/payment";

import type {
  ServicePrice,
} from "@/types/servicePrice";

export async function getServicePrices(
  serviceId: string
): Promise<
  ServicePrice[]
> {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase
    .from(
      "service_prices"
    )
    .select(`
      id,
      service_id,
      currency,
      amount,
      payment_method,
      payment_provider,
      active
    `)
    .eq(
      "service_id",
      serviceId
    )
    .eq(
      "active",
      true
    )
    .order(
      "currency"
    );

  if (error) {
    throw new Error(
      error.message
    );
  }

  return (
    data ?? []
  ).map(
    (price) => ({
      id:
        price.id,

      serviceId:
        price.service_id,

      currency:
        price.currency as Currency,

      amount:
        Number(
          price.amount
        ),

      paymentMethod:
        price.payment_method as PaymentMethod,

      paymentProvider:
        price.payment_provider as PaymentProvider,

      active:
        Boolean(
          price.active
        ),
    })
  );
}