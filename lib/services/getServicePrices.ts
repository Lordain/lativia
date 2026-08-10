import { createClient } from "@/lib/supabase/server";

export async function getServicePrices(
  serviceId: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("service_prices")
    .select(`
      id,
      service_id,
      currency,
      amount,
      payment_method,
      payment_provider,
      active
    `)
    .eq("service_id", serviceId)
    .eq("active", true)
    .order("currency");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((price) => ({
    id: price.id,
    serviceId: price.service_id,
    currency: price.currency,
    amount: Number(price.amount),
    paymentMethod: price.payment_method,
    paymentProvider: price.payment_provider,
    active: price.active,
  }));}