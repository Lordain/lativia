import { createClient } from "@/lib/supabase/server";

export async function getMyOrders() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log(
    "SERVER USER:",
    user?.id
  );

  console.log(
    "SERVER USER ERROR:",
    userError?.message
  );

  if (userError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      payment_status,
      amount,
      currency,
      created_at,
      form_data,

      services (
        title,
        slug
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "getMyOrders error:",
      error.message
    );

    throw new Error(
      error.message
    );
  }

  return (data ?? []).map(
    (order) => ({
      ...order,

      services: Array.isArray(
        order.services
      )
        ? order.services[0] ?? null
        : order.services,
    })
  );
}