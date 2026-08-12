import { createClient } from "@/lib/supabase/server";

interface AdminOrderService {
  title: string;
  slug: string;
}

interface AdminOrderProfile {
  name: string | null;
  phone: string | null;
}

export async function getAdminOrders() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      user_id,
      service_id,
      status,
      payment_status,
      amount,
      currency,
      payment_method,
      payment_provider,
      created_at,
      updated_at,

      services (
        title,
        slug
      ),

      profiles (
        name,
        phone
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "getAdminOrders error:",
      {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      }
    );

    throw new Error(error.message);
  }

  return (data ?? []).map((order) => {
    const service:
      AdminOrderService | null =
      Array.isArray(order.services)
        ? (order.services[0] ?? null) as
            | AdminOrderService
            | null
        : (order.services ?? null) as
            | AdminOrderService
            | null;

    const profile:
      AdminOrderProfile | null =
      Array.isArray(order.profiles)
        ? (order.profiles[0] ?? null) as
            | AdminOrderProfile
            | null
        : (order.profiles ?? null) as
            | AdminOrderProfile
            | null;

    return {
      ...order,
      services: service,
      profiles: profile,
    };
  });
}