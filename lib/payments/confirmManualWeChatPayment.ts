"use server";

import { requireAdmin } from "@/lib/auth/requireAdmin";

import { createAdminClient } from "@/lib/supabase/admin";

import { createPaymentAuditLog } from "@/lib/payments/createPaymentAuditLog";

import { safeEnsureOrderWorkspace } from "@/lib/workspaces/safeEnsureOrderWorkspace";

import { createOrderNotification } from "@/lib/notifications/createOrderNotification";

interface ManualPaymentOrder {
  id: string;

  amount: number | string | null;

  currency: string | null;

  payment_status: string;

  payment_method: string | null;

  payment_provider: string | null;

  paid_at: string | null;
}

async function ensureManualPaymentFulfillment(
  admin: ReturnType<
    typeof createAdminClient
  >,
  orderId: string
) {
  const {
    error,
  } =
    await admin.rpc(
      "ensure_paid_order_fulfillment",
      {
        p_order_id:
          orderId,
      }
    );

  if (error) {
    console.error(
      "ensure_paid_order_fulfillment error:",
      error
    );

    throw new Error(
      "付款已经确认，但建立办理任务失败，请重新进入订单后重试。"
    );
  }
}

export async function confirmManualWeChatPayment(orderId: string) {
  /*
   * ========================================
   * Admin Authorization
   * ========================================
   */

  const profile = await requireAdmin();

  const cleanOrderId = orderId.trim();

  if (!cleanOrderId) {
    throw new Error("订单编号无效");
  }

  const admin = createAdminClient();

  /*
   * ========================================
   * Read Order
   * ========================================
   */

  const {
    data: orderData,

    error: orderError,
  } = await admin
    .from("orders")
    .select(
      `
        id,
        amount,
        currency,
        payment_status,
        payment_method,
        payment_provider,
        paid_at
      `,
    )
    .eq("id", cleanOrderId)
    .maybeSingle();

  if (orderError) {
    console.error("confirmManualWeChatPayment order lookup error:", orderError);

    throw new Error("读取订单失败");
  }

  if (!orderData) {
    throw new Error("订单不存在");
  }

  const order = orderData as ManualPaymentOrder;

  /*
   * ========================================
   * Manual WeChat Payment Validation
   * ========================================
   *
   * 当前人工收款渠道必须严格满足：
   *
   * currency = CNY
   * payment_method = wechat_pay
   * payment_provider = null
   *
   * 防止管理员误把 Stripe / Mercado Pago
   * 或其他订单人工标记为付款成功。
   */

  const isManualWeChatPayment =
    order.currency === "CNY" &&
    order.payment_method === "wechat_pay" &&
    order.payment_provider === null;

  if (!isManualWeChatPayment) {
    await createPaymentAuditLog(admin, {
      orderId: order.id,

      adminUserId: profile.id,

      action: "manual_confirm",

      provider: null,

      result: "blocked",

      message: "订单不符合人工微信付款确认条件。",

      metadata: {
        currency: order.currency,

        paymentMethod: order.payment_method,

        paymentProvider: order.payment_provider,

        paymentStatus: order.payment_status,
      },
    });

    throw new Error("此订单不是可人工确认的人民币微信付款订单");
  }

  /*
   * ========================================
   * Idempotency
   * ========================================
   *
   * 管理员重复点击、浏览器重复提交时，
   * 已付款订单不再次写 paid_at。
   */

  if (order.payment_status === "paid") {
    await ensureManualPaymentFulfillment(
      admin,
      order.id
    );

    await safeEnsureOrderWorkspace(
      order.id
    );

    await createOrderNotification({
      orderId: order.id,

      type: "payment_confirmed",

      title: "付款已经确认",

      message:
        "您的付款已经确认。我们将按照服务要求检查资料，并开始后续办理流程。",

      idempotencyKey: `payment_confirmed:${order.id}`,

      metadata: {
        paymentMethod: "wechat_pay",

        manualConfirmation: true,
      },
    });

    return {
      confirmed: true,

      alreadyConfirmed: true,

      paidAt: order.paid_at,
    };
  }

  if (order.payment_status !== "unpaid") {
    await createPaymentAuditLog(admin, {
      orderId: order.id,

      adminUserId: profile.id,

      action: "manual_confirm",

      provider: null,

      result: "blocked",

      message: "订单当前付款状态不允许人工确认。",

      metadata: {
        paymentStatus: order.payment_status,
      },
    });

    throw new Error("当前付款状态不允许确认人工收款");
  }

  /*
   * ========================================
   * Conditional Update
   * ========================================
   *
   * 再次在数据库层限制：
   *
   * unpaid
   * CNY
   * wechat_pay
   * provider IS NULL
   *
   * 避免两个管理员同时点击导致重复确认。
   */

  const paidAt = new Date().toISOString();

  const {
    data: updatedOrder,

    error: updateError,
  } = await admin
    .from("orders")
    .update({
      payment_status: "paid",

      paid_at: paidAt,
    })
    .eq("id", order.id)
    .eq("payment_status", "unpaid")
    .eq("currency", "CNY")
    .eq("payment_method", "wechat_pay")
    .is("payment_provider", null)
    .select(
      `
        id,
        paid_at
      `,
    )
    .maybeSingle();

  if (updateError) {
    console.error("confirmManualWeChatPayment update error:", updateError);

    await createPaymentAuditLog(admin, {
      orderId: order.id,

      adminUserId: profile.id,

      action: "manual_confirm",

      provider: null,

      result: "failed",

      message: "人工微信付款确认数据库更新失败。",

      metadata: {
        error: updateError.message,
      },
    });

    throw new Error("确认人工收款失败");
  }

  /*
   * 条件 UPDATE 没有更新任何记录，
   * 通常代表另一个请求已经先完成确认。
   */

  if (!updatedOrder) {
    const { data: latestOrder } = await admin
      .from("orders")
      .select(
        `
          payment_status,
          paid_at
        `,
      )
      .eq("id", order.id)
      .maybeSingle();

      if (
        latestOrder?.payment_status ===
        "paid"
      ) {
        await ensureManualPaymentFulfillment(
          admin,
          order.id
        );

        await safeEnsureOrderWorkspace(
          order.id
        );

      await createOrderNotification({
        orderId: order.id,

        type: "payment_confirmed",

        title: "付款已经确认",

        message:
          "您的付款已经确认。我们将按照服务要求检查资料，并开始后续办理流程。",

        idempotencyKey: `payment_confirmed:${order.id}`,

        metadata: {
          paymentMethod: "wechat_pay",

          manualConfirmation: true,
        },
      });

      return {
        confirmed: true,

        alreadyConfirmed: true,

        paidAt: latestOrder.paid_at ?? null,
      };
    }

    throw new Error("订单状态已经发生变化，请刷新页面后重新确认");
  }

  /*
   * ========================================
   * Audit
   * ========================================
   */

  await createPaymentAuditLog(admin, {
    orderId: order.id,

    adminUserId: profile.id,

    action: "manual_confirm",

    provider: null,

    result: "success",

    message: "管理员已确认收到人民币微信人工付款。",

    metadata: {
      amount: order.amount,

      currency: order.currency,

      paymentMethod: order.payment_method,

      confirmedAt: updatedOrder.paid_at ?? paidAt,
    },
  });

  /*
   * ========================================
   * Post-payment Initialization
   * ========================================
   *
   * 与 Stripe / Mercado Pago
   * 付款成功后的后续行为保持一致。
   *
   * safeEnsureOrderWorkspace()
   * 本身具有幂等能力。
   */

  await ensureManualPaymentFulfillment(
    admin,
    order.id
  );

  await safeEnsureOrderWorkspace(
    order.id
  );

  /*
   * ========================================
   * Customer Notification
   * ========================================
   *
   * Notification 自身也使用固定
   * payment_confirmed:<orderId>
   * 做幂等保护。
   */

  await createOrderNotification({
    orderId: order.id,

    type: "payment_confirmed",

    title: "付款已经确认",

    message:
      "您的付款已经确认。我们将按照服务要求检查资料，并开始后续办理流程。",

    idempotencyKey: `payment_confirmed:${order.id}`,

    metadata: {
      paymentMethod: "wechat_pay",

      manualConfirmation: true,
    },
  });

  return {
    confirmed: true,

    alreadyConfirmed: false,

    paidAt: updatedOrder.paid_at ?? paidAt,
  };
}
