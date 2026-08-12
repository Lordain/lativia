import { createClient } from "@/lib/supabase/server";

export interface AdminDashboardStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  paidOrders: number;
  unpaidOrders: number;

  stripeOrders: number;
  mercadoPagoOrders: number;
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("orders")
      .select(`
        id,
        status,
        payment_status,
        payment_provider
      `);

  if (error) {
    console.error(
      "getAdminDashboardStats error:",
      error
    );

    throw new Error(
      error.message
    );
  }

  const orders =
    data ?? [];

  const totalOrders =
    orders.length;

  const pendingOrders =
    orders.filter(
      (order) =>
        order.status ===
        "pending"
    ).length;

  const processingOrders =
    orders.filter(
      (order) =>
        order.status ===
        "processing"
    ).length;

  const completedOrders =
    orders.filter(
      (order) =>
        order.status ===
        "completed"
    ).length;

  const paidOrders =
    orders.filter(
      (order) =>
        order.payment_status ===
        "paid"
    ).length;

  const unpaidOrders =
    orders.filter(
      (order) =>
        order.payment_status ===
        "unpaid"
    ).length;

  const stripeOrders =
    orders.filter(
      (order) =>
        order.payment_provider ===
        "stripe"
    ).length;

  const mercadoPagoOrders =
    orders.filter(
      (order) =>
        order.payment_provider ===
        "mercado_pago"
    ).length;

  return {
    totalOrders,
    pendingOrders,
    processingOrders,
    completedOrders,
    paidOrders,
    unpaidOrders,
    stripeOrders,
    mercadoPagoOrders,
  };
}