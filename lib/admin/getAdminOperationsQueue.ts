import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import type {
  AdminOperationItem,
  AdminOperationsQueue,
  AdminOperationPriority,
  AdminOperationType,
} from "@/types/adminOperation";

interface FulfillmentRow {
  id: string;

  order_id: string;
  service_id: string;

  status: string;

  current_step:
    string | null;

  human_review_required:
    boolean;

  human_review_reason:
    string | null;

  customer_action_required:
    boolean;

  customer_action_reason:
    string | null;

  failure_reason:
    string | null;

  refund_review_required:
    boolean;

  created_at:
    string;

  updated_at:
    string;
}

interface ProfileRow {
  name:
    string | null;

  phone:
    string | null;
}

interface OrderRow {
  id: string;

  user_id:
    string | null;

  service_id:
    string | null;

  payment_status:
    string;

  created_at:
    string;

  updated_at:
    string | null;

  profiles:
    ProfileRow |
    ProfileRow[] |
    null;
}

interface ServiceRow {
  id: string;

  title:
    string | null;
}

interface PaymentTransactionRow {
  id: string;

  order_id: string;

  status: string;

  provider: string;

  created_at: string;
}

/*
 * =====================================
 * Helpers
 * =====================================
 */

function getSingleProfile(
  value:
    ProfileRow |
    ProfileRow[] |
    null |
    undefined
): ProfileRow | null {
  if (
    Array.isArray(
      value
    )
  ) {
    return (
      value[0] ??
      null
    );
  }

  return (
    value ??
    null
  );
}

function getAgeHours(
  dateValue: string
) {
  const timestamp =
    new Date(
      dateValue
    ).getTime();

  if (
    Number.isNaN(
      timestamp
    )
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(
      (
        Date.now() -
        timestamp
      ) /
        (
          1000 *
          60 *
          60
        )
    )
  );
}

/*
 * =====================================
 * Fulfillment → Operation Type
 * =====================================
 */

function getOperationType(
  fulfillment:
    FulfillmentRow
): AdminOperationType | null {
  /*
   * completed 是永久终态。
   * 无论历史 flag 是否残留，
   * 都绝对不能进入 Admin Queue。
   */
  if (
    fulfillment.status ===
    "completed"
  ) {
    return null;
  }

  /*
   * 正常自动流程不进入人工 Queue。
   */
  if (
    fulfillment.status ===
      "queued" ||
    fulfillment.status ===
      "validating" ||
    fulfillment.status ===
      "processing"
  ) {
    return null;
  }

  if (
    fulfillment.status ===
    "refund_review"
  ) {
    return "refund_review";
  }

  if (
    fulfillment.status ===
    "manual_review"
  ) {
    return "manual_review";
  }

  if (
    fulfillment.status ===
    "waiting_human"
  ) {
    return "waiting_human";
  }

  if (
    fulfillment.status ===
    "waiting_customer"
  ) {
    return "waiting_customer";
  }

  /*
   * 服务已经失败，
   * 但还没有明确进入：
   *
   * manual_review
   * 或
   * refund_review
   *
   * 不能让它从运营视野里消失。
   */
  if (
    fulfillment.status ===
    "failed"
  ) {
    /*
     * Refund 已明确审核拒绝，
     * 这已经是一个完成的运营决定，
     * 不应该再次回到
     * failed_pending_review Queue。
     */
    if (
      fulfillment.current_step ===
        "refund_rejected" ||
      fulfillment.current_step ===
        "refund_succeeded"
    ) {
      return null;
    }
  
    if (
      fulfillment
        .refund_review_required
    ) {
      return "refund_review";
    }
  
    if (
      fulfillment
        .human_review_required
    ) {
      return "manual_review";
    }
  
    return "failed_pending_review";
  }

  return null;
}

/*
 * =====================================
 * Operation Reason
 * =====================================
 */

function getOperationReason(
  fulfillment:
    FulfillmentRow,
  type:
    AdminOperationType
) {
  switch (type) {
    case "refund_review":
      return (
        fulfillment
          .failure_reason ??
        "服务未完成，需要审核退款资格。"
      );

    case "manual_review":
      return (
        fulfillment
          .human_review_reason ??
        fulfillment
          .failure_reason ??
        "当前结果需要工作人员进一步复核。"
      );

    case "waiting_human":
      return (
        fulfillment
          .human_review_reason ??
        "自动流程需要工作人员介入处理。"
      );

    case "waiting_customer":
      return (
        fulfillment
          .customer_action_reason ??
        "需要客户补充资料或完成操作。"
      );

    case "failed_pending_review":
      return (
        fulfillment
          .failure_reason ??
        "服务办理失败，需要管理员判断下一步处理方式。"
      );

    case "missing_fulfillment":
    case "paid_without_transaction":
    case "transaction_paid_order_unpaid":
      return null;
  }
}

/*
 * =====================================
 * Priority
 * =====================================
 */

function getPriority(
  type:
    AdminOperationType,
  ageHours:
    number
): AdminOperationPriority {
  /*
   * 支付 / 系统一致性异常：
   * 最高优先级。
   */
  if (
    type ===
      "missing_fulfillment" ||
    type ===
      "paid_without_transaction" ||
    type ===
      "transaction_paid_order_unpaid"
  ) {
    return "critical";
  }

  /*
   * 服务已经失败但无人决定下一步，
   * 优先级应高于普通人工处理。
   */
  if (
    type ===
    "failed_pending_review"
  ) {
    return ageHours >= 24
      ? "critical"
      : "high";
  }

  /*
   * 其他真正的人工待办
   * 超过 48 小时统一升级。
   */
  if (
    ageHours >= 48
  ) {
    return "critical";
  }

  if (
    type ===
      "refund_review" ||
    type ===
      "manual_review"
  ) {
    return "high";
  }

  if (
    type ===
    "waiting_human"
  ) {
    return ageHours >= 24
      ? "high"
      : "medium";
  }

  if (
    type ===
    "waiting_customer"
  ) {
    return ageHours >= 24
      ? "medium"
      : "low";
  }

  return "low";
}

function getPriorityScore(
  priority:
    AdminOperationPriority
) {
  switch (priority) {
    case "critical":
      return 4;

    case "high":
      return 3;

    case "medium":
      return 2;

    case "low":
      return 1;
  }
}

/*
 * =====================================
 * Main Query
 * =====================================
 */

export async function getAdminOperationsQueue():
Promise<AdminOperationsQueue> {
  await requireAdmin();

  const supabase =
    createAdminClient();

  /*
   * =====================================
   * Fulfillments
   * =====================================
   */

  const {
    data:
      fulfillmentData,
    error:
      fulfillmentError,
  } =
    await supabase
      .from(
        "fulfillments"
      )
      .select(`
        id,
        order_id,
        service_id,
        status,
        current_step,
        human_review_required,
        human_review_reason,
        customer_action_required,
        customer_action_reason,
        failure_reason,
        refund_review_required,
        created_at,
        updated_at
      `);

  if (
    fulfillmentError
  ) {
    console.error(
      "getAdminOperationsQueue fulfillment error:",
      fulfillmentError
    );

    throw new Error(
      "读取办理队列失败"
    );
  }

  const fulfillments =
    (
      fulfillmentData ??
      []
    ) as FulfillmentRow[];

  /*
   * =====================================
   * Orders
   * =====================================
   */

  const {
    data:
      orderData,
    error:
      orderError,
  } =
    await supabase
      .from(
        "orders"
      )
      .select(`
        id,
        user_id,
        service_id,
        payment_status,
        created_at,
        updated_at,

        profiles (
          name,
          phone
        )
      `);

  if (
    orderError
  ) {
    console.error(
      "getAdminOperationsQueue order error:",
      orderError
    );

    throw new Error(
      "读取运营订单失败"
    );
  }

  const orders =
    (
      orderData ??
      []
    ) as OrderRow[];

  /*
   * =====================================
   * Services
   * =====================================
   */

  const {
    data:
      serviceData,
    error:
      serviceError,
  } =
    await supabase
      .from(
        "services"
      )
      .select(`
        id,
        title
      `);

  if (
    serviceError
  ) {
    console.error(
      "getAdminOperationsQueue service error:",
      serviceError
    );

    throw new Error(
      "读取服务资料失败"
    );
  }

  const services =
    (
      serviceData ??
      []
    ) as ServiceRow[];

  /*
   * =====================================
   * Payment Transactions
   * =====================================
   */

  const {
    data:
      transactionData,
    error:
      transactionError,
  } =
    await supabase
      .from(
        "payment_transactions"
      )
      .select(`
        id,
        order_id,
        status,
        provider,
        created_at
      `);

  if (
    transactionError
  ) {
    console.error(
      "getAdminOperationsQueue transaction error:",
      transactionError
    );

    throw new Error(
      "读取支付交易失败"
    );
  }

  const transactions =
    (
      transactionData ??
      []
    ) as PaymentTransactionRow[];

  /*
   * =====================================
   * Lookup Maps
   * =====================================
   */

  const orderMap =
    new Map<
      string,
      OrderRow
    >();

  for (
    const order
    of orders
  ) {
    orderMap.set(
      order.id,
      order
    );
  }

  const serviceMap =
    new Map<
      string,
      ServiceRow
    >();

  for (
    const service
    of services
  ) {
    serviceMap.set(
      service.id,
      service
    );
  }

  const transactionsByOrder =
    new Map<
      string,
      PaymentTransactionRow[]
    >();

  for (
    const transaction
    of transactions
  ) {
    const current =
      transactionsByOrder.get(
        transaction.order_id
      ) ?? [];

    current.push(
      transaction
    );

    transactionsByOrder.set(
      transaction.order_id,
      current
    );
  }

  const fulfillmentOrderIds =
    new Set(
      fulfillments.map(
        (
          fulfillment
        ) =>
          fulfillment.order_id
      )
    );

  const items:
    AdminOperationItem[] =
    [];

  /*
   * =====================================
   * 1. Fulfillment Operations
   * =====================================
   */

  for (
    const fulfillment
    of fulfillments
  ) {
    const type =
      getOperationType(
        fulfillment
      );

    if (!type) {
      continue;
    }

    const order =
      orderMap.get(
        fulfillment.order_id
      );

    if (!order) {
      console.error(
        "Fulfillment without order:",
        fulfillment.id
      );

      continue;
    }

    const service =
      serviceMap.get(
        fulfillment.service_id
      );

    const profile =
      getSingleProfile(
        order.profiles
      );

    /*
     * updated_at 目前作为
     * 当前 Queue 等待时间的近似值。
     */
    const ageHours =
      getAgeHours(
        fulfillment
          .updated_at
      );

    const priority =
      getPriority(
        type,
        ageHours
      );

    items.push({
      type,

      priority,

      orderId:
        order.id,

      fulfillmentId:
        fulfillment.id,

      serviceId:
        fulfillment.service_id,

      serviceTitle:
        service?.title ??
        "未知服务",

      customerName:
        profile?.name ??
        null,

      customerPhone:
        profile?.phone ??
        null,

      fulfillmentStatus:
        fulfillment.status,

      currentStep:
        fulfillment.current_step,

      reason:
        getOperationReason(
          fulfillment,
          type
        ),

      humanReviewRequired:
        fulfillment
          .human_review_required,

      customerActionRequired:
        fulfillment
          .customer_action_required,

      refundReviewRequired:
        fulfillment
          .refund_review_required,

      createdAt:
        fulfillment
          .updated_at,

      updatedAt:
        fulfillment
          .updated_at,

      ageHours,
    });
  }

  /*
   * =====================================
   * 2. Missing Fulfillment
   *
   * Order paid
   * +
   * no Fulfillment
   *
   * 客户已经付款但服务流程未启动，
   * 属于最高风险异常。
   * =====================================
   */

  for (
    const order
    of orders
  ) {
    if (
      order.payment_status !==
      "paid"
    ) {
      continue;
    }

    if (
      fulfillmentOrderIds.has(
        order.id
      )
    ) {
      continue;
    }

    const profile =
      getSingleProfile(
        order.profiles
      );

    const service =
      order.service_id
        ? serviceMap.get(
            order.service_id
          )
        : null;

    const agingDate =
      order.updated_at ??
      order.created_at;

    const ageHours =
      getAgeHours(
        agingDate
      );

    items.push({
      type:
        "missing_fulfillment",

      priority:
        "critical",

      orderId:
        order.id,

      fulfillmentId:
        null,

      serviceId:
        order.service_id ??
        "",

      serviceTitle:
        service?.title ??
        "未知服务",

      customerName:
        profile?.name ??
        null,

      customerPhone:
        profile?.phone ??
        null,

      fulfillmentStatus:
        null,

      currentStep:
        null,

      reason:
        "付款已经确认，但系统没有建立对应办理任务。客户已付款但服务流程没有启动，需要立即检查。",

      humanReviewRequired:
        true,

      customerActionRequired:
        false,

      refundReviewRequired:
        false,

      createdAt:
        agingDate,

      updatedAt:
        agingDate,

      ageHours,
    });
  }

  /*
   * =====================================
   * 3. Paid Without Transaction
   *
   * Order = paid
   * Fulfillment exists
   * Payment transaction missing
   *
   * 如果 Fulfillment 也不存在，
   * 已经由 missing_fulfillment 表示，
   * 不重复生成第二条。
   * =====================================
   */

  for (
    const order
    of orders
  ) {
    if (
      order.payment_status !==
      "paid"
    ) {
      continue;
    }

    if (
      !fulfillmentOrderIds.has(
        order.id
      )
    ) {
      continue;
    }

    const orderTransactions =
      transactionsByOrder.get(
        order.id
      ) ?? [];

    if (
      orderTransactions.length >
      0
    ) {
      continue;
    }

    const profile =
      getSingleProfile(
        order.profiles
      );

    const service =
      order.service_id
        ? serviceMap.get(
            order.service_id
          )
        : null;

    const agingDate =
      order.updated_at ??
      order.created_at;

    const ageHours =
      getAgeHours(
        agingDate
      );

    items.push({
      type:
        "paid_without_transaction",

      priority:
        "critical",

      orderId:
        order.id,

      fulfillmentId:
        null,

      serviceId:
        order.service_id ??
        "",

      serviceTitle:
        service?.title ??
        "未知服务",

      customerName:
        profile?.name ??
        null,

      customerPhone:
        profile?.phone ??
        null,

      fulfillmentStatus:
        null,

      currentStep:
        null,

      reason:
        "订单已经标记为已付款，但没有找到对应支付交易记录，需要检查 Webhook、付款确认和支付对账数据。",

      humanReviewRequired:
        true,

      customerActionRequired:
        false,

      refundReviewRequired:
        false,

      createdAt:
        agingDate,

      updatedAt:
        agingDate,

      ageHours,
    });
  }

  /*
   * =====================================
   * 4. Payment Transaction Paid
   *    but Order not paid
   * =====================================
   */

  for (
    const order
    of orders
  ) {
    if (
      order.payment_status ===
      "paid"
    ) {
      continue;
    }

    const orderTransactions =
      transactionsByOrder.get(
        order.id
      ) ?? [];

    const paidTransaction =
      orderTransactions.find(
        (
          transaction
        ) =>
          transaction.status ===
          "paid"
      );

    if (!paidTransaction) {
      continue;
    }

    const profile =
      getSingleProfile(
        order.profiles
      );

    const service =
      order.service_id
        ? serviceMap.get(
            order.service_id
          )
        : null;

    const ageHours =
      getAgeHours(
        paidTransaction
          .created_at
      );

    items.push({
      type:
        "transaction_paid_order_unpaid",

      priority:
        "critical",

      orderId:
        order.id,

      fulfillmentId:
        null,

      serviceId:
        order.service_id ??
        "",

      serviceTitle:
        service?.title ??
        "未知服务",

      customerName:
        profile?.name ??
        null,

      customerPhone:
        profile?.phone ??
        null,

      fulfillmentStatus:
        null,

      currentStep:
        null,

      reason:
        "支付交易已经确认成功，但订单付款状态尚未同步，需要核验支付状态并进行安全修复。",

      humanReviewRequired:
        true,

      customerActionRequired:
        false,

      refundReviewRequired:
        false,

      createdAt:
        paidTransaction
          .created_at,

      updatedAt:
        paidTransaction
          .created_at,

      ageHours,
    });
  }


    /*
   * =====================================
   * Deduplicate by Order
   *
   * 同一订单理论上只保留一个
   * 当前最重要的运营待办。
   *
   * 优先级规则：
   *
   * critical > high > medium > low
   *
   * 同级时保留等待更久的项目。
   * =====================================
   */

    const deduplicatedMap =
    new Map<
      string,
      AdminOperationItem
    >();

  for (
    const item
    of items
  ) {
    const existing =
      deduplicatedMap.get(
        item.orderId
      );

    if (!existing) {
      deduplicatedMap.set(
        item.orderId,
        item
      );

      continue;
    }

    const existingScore =
      getPriorityScore(
        existing.priority
      );

    const newScore =
      getPriorityScore(
        item.priority
      );

    if (
      newScore >
      existingScore
    ) {
      deduplicatedMap.set(
        item.orderId,
        item
      );

      continue;
    }

    if (
      newScore ===
        existingScore &&
      item.ageHours >
        existing.ageHours
    ) {
      deduplicatedMap.set(
        item.orderId,
        item
      );
    }
  }

  const deduplicatedItems =
    Array.from(
      deduplicatedMap.values()
    );

  /*
   * =====================================
   * Sort
   *
   * 先风险，
   * 再等待时间。
   * =====================================
   */

  deduplicatedItems.sort(
    (
      a,
      b
    ) => {
      const priorityDiff =
        getPriorityScore(
          b.priority
        ) -
        getPriorityScore(
          a.priority
        );

      if (
        priorityDiff !== 0
      ) {
        return priorityDiff;
      }

      return (
        b.ageHours -
        a.ageHours
      );
    }
  );

  /*
   * =====================================
   * Summary Counts
   * =====================================
   */

  const counts = {
    total:
      items.length,

    waitingHuman:
      deduplicatedItems.filter(
        (
          item
        ) =>
          item.type ===
          "waiting_human"
      ).length,

    waitingCustomer:
      deduplicatedItems.filter(
        (
          item
        ) =>
          item.type ===
          "waiting_customer"
      ).length,

    manualReview:
      deduplicatedItems.filter(
        (
          item
        ) =>
          item.type ===
          "manual_review"
      ).length,

    refundReview:
      deduplicatedItems.filter(
        (
          item
        ) =>
          item.type ===
          "refund_review"
      ).length,

    failedPendingReview:
      deduplicatedItems.filter(
        (
          item
        ) =>
          item.type ===
          "failed_pending_review"
      ).length,

    missingFulfillment:
      deduplicatedItems.filter(
        (
          item
        ) =>
          item.type ===
          "missing_fulfillment"
      ).length,

    paidWithoutTransaction:
      deduplicatedItems.filter(
        (
          item
        ) =>
          item.type ===
          "paid_without_transaction"
      ).length,

    transactionPaidOrderUnpaid:
      deduplicatedItems.filter(
        (
          item
        ) =>
          item.type ===
          "transaction_paid_order_unpaid"
      ).length,

    /*
     * 这里只统计真正的 Operations Queue
     * 等待超过 24h 的任务。
     *
     * 普通未付款订单已经完全排除。
     */
    overdue24h:
      deduplicatedItems.filter(
        (
          item
        ) =>
          item.ageHours >=
          24
      ).length,
  };

  return {
    items: deduplicatedItems,
    counts,
  };
}