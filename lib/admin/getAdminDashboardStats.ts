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

  paymentExceptions: number;
  paidWithoutTransaction: number;
  transactionPaidOrderUnpaid: number;

  overdueUnpaidOrders: number;
  overduePendingOrders: number;
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
        currency,
        payment_method,
        payment_provider,
        created_at,

        payment_transactions (
          id,
          status
        )
      `)

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

  const twentyFourHoursAgo =
    Date.now() -
    24 * 60 * 60 * 1000;

  const overdueUnpaidOrders =
    orders.filter(
      (order) =>
        order.payment_status ===
          "unpaid" &&
        new Date(
          order.created_at
        ).getTime() <
          twentyFourHoursAgo
    ).length;

  const overduePendingOrders =
    orders.filter(
      (order) =>
        order.status ===
          "pending" &&
        new Date(
          order.created_at
        ).getTime() <
          twentyFourHoursAgo
    ).length;

  const totalOrders =
    orders.length;

  const pendingOrders =
    orders.filter(
      (order) =>
        order.status === "pending"
    ).length;

  const processingOrders =
    orders.filter(
      (order) =>
        order.status === "processing"
    ).length;

  const completedOrders =
    orders.filter(
      (order) =>
        order.status === "completed"
    ).length;

  const paidOrders =
    orders.filter(
      (order) =>
        order.payment_status === "paid"
    ).length;

  const unpaidOrders =
    orders.filter(
      (order) =>
        order.payment_status === "unpaid"
    ).length;

  const stripeOrders =
    orders.filter(
      (order) =>
        order.payment_provider === "stripe"
    ).length;

  const mercadoPagoOrders =
    orders.filter(
      (order) =>
        order.payment_provider === "mercado_pago"
    ).length;

    const paidWithoutTransaction =
    orders.filter((order) => {
      const transactions =
        order.payment_transactions ?? [];

      const hasPaidTransaction =
        transactions.some(
          (transaction) =>
            transaction.status === "paid"
        );


        const isManualWeChatPayment =
        order.currency ===
          "CNY" &&
        order.payment_method ===
          "wechat_pay" &&
        order.payment_provider ===
          null;


      return (
        order.payment_status ===
          "paid" &&
        !hasPaidTransaction &&
        !isManualWeChatPayment
      );
    }).length;

  const transactionPaidOrderUnpaid =
    orders.filter((order) => {
      const transactions =
        order.payment_transactions ?? [];

      const hasPaidTransaction =
        transactions.some(
          (transaction) =>
            transaction.status === "paid"
        );

      return (
        order.payment_status !== "paid" &&
        hasPaidTransaction
      );
    }).length;

  const paymentExceptions =
    paidWithoutTransaction +
    transactionPaidOrderUnpaid;

  return {
    totalOrders,
    pendingOrders,
    processingOrders,
    completedOrders,

    paidOrders,
    unpaidOrders,

    stripeOrders,
    mercadoPagoOrders,

    paymentExceptions,
    paidWithoutTransaction,
    transactionPaidOrderUnpaid,
    overdueUnpaidOrders,
    overduePendingOrders,
  };
}
