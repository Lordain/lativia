import { createClient } from "@/lib/supabase/server";

export async function getMyOrder(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("orders")
    .select(`
        id,
        status,
        payment_status,
        amount,
        currency,
        payment_method,
        payment_provider,
        paid_at,
        created_at,
        updated_at,
        form_data,
        service_id,
        services (
          title,
          slug
        )
      `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("getMyOrder error:", error.message);
    return null;
  }

  return data;
}