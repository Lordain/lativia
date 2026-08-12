import { createClient } from "@/lib/supabase/server";

import {
  getBusinessDayRange,
} from "@/lib/time/businessTime";

export interface TodayAdminStats {
  newOrders: number;
  completedOrders: number;
  confirmedPayments: number;
  revenueMXN: number;
  revenueCNY: number;
}

export async function getTodayAdminStats(): Promise<TodayAdminStats> {
  const supabase =
    await createClient();

  // ========================================
  // 1. Mexico City Business Day
  // ========================================

  const {
    start,
    end,
  } = getBusinessDayRange();

  const startIso =
    start.toISOString();

  const endIso =
    end.toISOString();

  // ========================================
  // 2. 今日新增订单
  // ========================================

  const {
    data: orders,
    error: ordersError,
  } = await supabase
    .from("orders")
    .select(`
      id,
      created_at
    `)
    .gte(
      "created_at",
      startIso
    )
    .lt(
      "created_at",
      endIso
    );

  if (ordersError) {
    console.error(
      "getTodayAdminStats orders error:",
      ordersError
    );

    throw new Error(
      ordersError.message
    );
  }

  const newOrders =
    orders?.length ?? 0;

  // ========================================
  // 3. 今日完成订单
  // 当前暂时使用：
  // status = completed
  // updated_at 位于今天
  // ========================================

  const {
    data:
      completedOrdersData,
    error:
      completedOrdersError,
  } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      updated_at
    `)
    .eq(
      "status",
      "completed"
    )
    .gte(
      "updated_at",
      startIso
    )
    .lt(
      "updated_at",
      endIso
    );

  if (
    completedOrdersError
  ) {
    console.error(
      "getTodayAdminStats completed orders error:",
      completedOrdersError
    );

    throw new Error(
      completedOrdersError.message
    );
  }

  const completedOrders =
    completedOrdersData
      ?.length ?? 0;

  // ========================================
  // 4. 今日确认付款
  // ========================================

  const {
    data: payments,
    error: paymentsError,
  } = await supabase
    .from(
      "payment_transactions"
    )
    .select(`
      id,
      amount,
      currency,
      status,
      created_at
    `)
    .eq(
      "status",
      "paid"
    )
    .gte(
      "created_at",
      startIso
    )
    .lt(
      "created_at",
      endIso
    );

  if (paymentsError) {
    console.error(
      "getTodayAdminStats payments error:",
      paymentsError
    );

    throw new Error(
      paymentsError.message
    );
  }

  const confirmedPayments =
    payments?.length ?? 0;

  // ========================================
  // 5. 今日 MXN 收入
  // ========================================

  const revenueMXN =
    (
      payments ?? []
    )
      .filter(
        (payment) =>
          payment.currency ===
          "MXN"
      )
      .reduce(
        (
          total,
          payment
        ) =>
          total +
          Number(
            payment.amount
          ),
        0
      );

  // ========================================
  // 6. 今日 CNY 收入
  // ========================================

  const revenueCNY =
    (
      payments ?? []
    )
      .filter(
        (payment) =>
          payment.currency ===
          "CNY"
      )
      .reduce(
        (
          total,
          payment
        ) =>
          total +
          Number(
            payment.amount
          ),
        0
      );

  return {
    newOrders,
    completedOrders,
    confirmedPayments,
    revenueMXN,
    revenueCNY,
  };
}