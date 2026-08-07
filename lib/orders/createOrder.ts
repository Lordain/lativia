import type { CreateOrderInput } from "@/types/order";
import { createClient } from "@/lib/supabase/client";

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

  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      service_id: input.serviceId,
      form_data: input.formData,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}