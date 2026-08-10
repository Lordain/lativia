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

  return data ?? [];
}