import { createClient } from "@/lib/supabase/client";
import type { CreateOrderInput } from "@/types/order";

export async function createOrder(
  input: CreateOrderInput
) {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("请先登录后再提交申请");
  }

  const { data: price, error: priceError } =
    await supabase
      .from("service_prices")
      .select(`
        id,
        service_id,
        amount,
        currency,
        payment_method,
        payment_provider,
        active
      `)
      .eq("id", input.priceId)
      .eq("service_id", input.serviceId)
      .eq("active", true)
      .single();

  if (priceError || !price) {
    throw new Error("付款方案不存在或已失效");
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      service_id: input.serviceId,
      form_data: input.formData,

      status: "pending",
      payment_status: "unpaid",

      amount: price.amount,
      currency: price.currency,
      payment_method: price.payment_method,
      payment_provider: price.payment_provider,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}