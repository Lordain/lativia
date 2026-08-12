import { createClient } from "@/lib/supabase/server";

interface RecentOrderService {
  title: string;
}

interface RecentOrderProfile {
  name: string | null;
}

export async function getRecentAdminActivity() {
  const supabase =
    await createClient();

  const {
    data: recentOrdersRaw,
    error: orderError,
  } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      payment_status,
      amount,
      currency,
      created_at,

      services (
        title
      ),

      profiles (
        name
      )
    `)
    .order(
      "created_at",
      {
        ascending: false,
      }
    )
    .limit(5);

  if (orderError) {
    console.error(
      "getRecentAdminActivity orders error:",
      orderError
    );

    throw new Error(
      orderError.message
    );
  }

  const recentOrders =
    (
      recentOrdersRaw ??
      []
    ).map(
      (order) => {
        const service:
          RecentOrderService | null =
          Array.isArray(
            order.services
          )
            ? (
                order
                  .services[0] ??
                null
              ) as
                | RecentOrderService
                | null
            : (
                order.services ??
                null
              ) as
                | RecentOrderService
                | null;

        const profile:
          RecentOrderProfile | null =
          Array.isArray(
            order.profiles
          )
            ? (
                order
                  .profiles[0] ??
                null
              ) as
                | RecentOrderProfile
                | null
            : (
                order.profiles ??
                null
              ) as
                | RecentOrderProfile
                | null;

        return {
          ...order,
          services:
            service,
          profiles:
            profile,
        };
      }
    );

  const {
    data: recentPayments,
    error: paymentError,
  } = await supabase
    .from(
      "payment_transactions"
    )
    .select(`
      id,
      order_id,
      provider,
      amount,
      currency,
      status,
      created_at
    `)
    .order(
      "created_at",
      {
        ascending: false,
      }
    )
    .limit(5);

  if (paymentError) {
    console.error(
      "getRecentAdminActivity payments error:",
      paymentError
    );

    throw new Error(
      paymentError.message
    );
  }

  return {
    recentOrders,
    recentPayments:
      recentPayments ?? [],
  };
}