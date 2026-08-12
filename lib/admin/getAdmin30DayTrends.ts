import { createClient } from "@/lib/supabase/server";

import {
  BUSINESS_TIME_ZONE,
  getBusinessDayRange,
} from "@/lib/time/businessTime";

export interface AdminTrendDay {
  date: string;
  label: string;
  orders: number;
  revenueMXN: number;
  revenueCNY: number;
}

export interface Admin30DayTrends {
  days: AdminTrendDay[];

  totals: {
    orders: number;
    revenueMXN: number;
    revenueCNY: number;
  };
}

interface BusinessDateParts {
  year: number;
  month: number;
  day: number;
}

function getBusinessDateParts(
  date: Date
): BusinessDateParts {
  const formatter =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          BUSINESS_TIME_ZONE,

        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    );

  const parts =
    formatter.formatToParts(
      date
    );

  const year =
    Number(
      parts.find(
        (part) =>
          part.type === "year"
      )?.value
    );

  const month =
    Number(
      parts.find(
        (part) =>
          part.type === "month"
      )?.value
    );

  const day =
    Number(
      parts.find(
        (part) =>
          part.type === "day"
      )?.value
    );

  return {
    year,
    month,
    day,
  };
}

function formatDateKey(
  year: number,
  month: number,
  day: number
) {
  return [
    year,
    String(month).padStart(
      2,
      "0"
    ),
    String(day).padStart(
      2,
      "0"
    ),
  ].join("-");
}

function formatDateLabel(
  month: number,
  day: number
) {
  return `${String(
    month
  ).padStart(
    2,
    "0"
  )}/${String(
    day
  ).padStart(
    2,
    "0"
  )}`;
}

function addCalendarDays(
  year: number,
  month: number,
  day: number,
  amount: number
): BusinessDateParts {
  const date =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day + amount,
        12,
        0,
        0
      )
    );

  return {
    year:
      date.getUTCFullYear(),

    month:
      date.getUTCMonth() +
      1,

    day:
      date.getUTCDate(),
  };
}

function getUtcRangeForBusinessDate(
  year: number,
  month: number,
  day: number
) {
  /*
   * 使用当地日期中午作为 reference，
   * 避免跨时区时 reference 落到前一天。
   */
  const reference =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day,
        12,
        0,
        0
      )
    );

  return getBusinessDayRange(
    reference
  );
}

export async function getAdmin30DayTrends(): Promise<Admin30DayTrends> {
  const supabase =
    await createClient();

  // ========================================
  // 1. 找到 Mexico City 的“今天”
  // ========================================

  const now =
    new Date();

  const today =
    getBusinessDateParts(
      now
    );

  // ========================================
  // 2. 计算 30 天窗口
  //
  // 包含今天，所以：
  // today - 29 days
  // →
  // today
  // ========================================

  const firstDay =
    addCalendarDays(
      today.year,
      today.month,
      today.day,
      -29
    );

  const afterLastDay =
    addCalendarDays(
      today.year,
      today.month,
      today.day,
      1
    );

  const firstRange =
    getUtcRangeForBusinessDate(
      firstDay.year,
      firstDay.month,
      firstDay.day
    );

  const afterLastRange =
    getUtcRangeForBusinessDate(
      afterLastDay.year,
      afterLastDay.month,
      afterLastDay.day
    );

  const startIso =
    firstRange.start.toISOString();

  /*
   * afterLastDay.start 就是整个
   * 30-day window 的结束边界。
   */
  const endIso =
    afterLastRange.start.toISOString();

  // ========================================
  // 3. 一次查询最近 30 天订单
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
      "getAdmin30DayTrends orders error:",
      ordersError
    );

    throw new Error(
      ordersError.message
    );
  }

  // ========================================
  // 4. 一次查询最近 30 天已确认付款
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
      "getAdmin30DayTrends payments error:",
      paymentsError
    );

    throw new Error(
      paymentsError.message
    );
  }

  // ========================================
  // 5. 建立完整 30 天数组
  // ========================================

  const days:
    AdminTrendDay[] =
    [];

  for (
    let index = 0;
    index < 30;
    index += 1
  ) {
    const current =
      addCalendarDays(
        firstDay.year,
        firstDay.month,
        firstDay.day,
        index
      );

    days.push({
      date:
        formatDateKey(
          current.year,
          current.month,
          current.day
        ),

      label:
        formatDateLabel(
          current.month,
          current.day
        ),

      orders: 0,

      revenueMXN: 0,

      revenueCNY: 0,
    });
  }

  // ========================================
  // 6. 建立快速查找 Map
  // ========================================

  const dayMap =
    new Map<
      string,
      AdminTrendDay
    >();

  for (const day of days) {
    dayMap.set(
      day.date,
      day
    );
  }

  // ========================================
  // 7. 将订单分配到 Mexico City 日期
  // ========================================

  for (
    const order of
      orders ?? []
  ) {
    const localDate =
      getBusinessDateParts(
        new Date(
          order.created_at
        )
      );

    const key =
      formatDateKey(
        localDate.year,
        localDate.month,
        localDate.day
      );

    const target =
      dayMap.get(key);

    if (target) {
      target.orders += 1;
    }
  }

  // ========================================
  // 8. 将收入分配到 Mexico City 日期
  // ========================================

  for (
    const payment of
      payments ?? []
  ) {
    const localDate =
      getBusinessDateParts(
        new Date(
          payment.created_at
        )
      );

    const key =
      formatDateKey(
        localDate.year,
        localDate.month,
        localDate.day
      );

    const target =
      dayMap.get(key);

    if (!target) {
      continue;
    }

    const amount =
      Number(
        payment.amount ?? 0
      );

    if (
      payment.currency ===
      "MXN"
    ) {
      target.revenueMXN +=
        amount;
    }

    if (
      payment.currency ===
      "CNY"
    ) {
      target.revenueCNY +=
        amount;
    }
  }

  // ========================================
  // 9. Totals
  // ========================================

  const totals =
    days.reduce(
      (
        result,
        day
      ) => {
        result.orders +=
          day.orders;

        result.revenueMXN +=
          day.revenueMXN;

        result.revenueCNY +=
          day.revenueCNY;

        return result;
      },
      {
        orders: 0,
        revenueMXN: 0,
        revenueCNY: 0,
      }
    );

  return {
    days,
    totals,
  };
}