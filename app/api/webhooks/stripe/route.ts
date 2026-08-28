import {
  NextResponse,
} from "next/server";

import {
  headers,
} from "next/headers";

import {
  createClient,
} from "@supabase/supabase-js";

import {
  stripe,
} from "@/lib/payments/stripe";

import {
  createOrderNotification,
} from "@/lib/notifications/createOrderNotification";

import {
  safeEnsureOrderWorkspace,
} from "@/lib/workspaces/safeEnsureOrderWorkspace";


export async function POST(
  request: Request
) {
  const body =
    await request.text();


  const headerList =
    await headers();


  const signature =
    headerList.get(
      "stripe-signature"
    );


  if (!signature) {
    return NextResponse.json(
      {
        error:
          "缺少 Stripe signature",
      },
      {
        status:
          400,
      }
    );
  }


  let event;


  /*
   * ========================================
   * 1. Verify Stripe Signature
   * ========================================
   */

  try {
    event =
      stripe.webhooks.constructEvent(
        body,
        signature,
        process.env
          .STRIPE_WEBHOOK_SECRET!
      );

  } catch {
    console.error(
      "Stripe webhook signature verification failed"
    );


    return NextResponse.json(
      {
        error:
          "Webhook signature 驗證失敗",
      },
      {
        status:
          400,
      }
    );
  }


  /*
   * ========================================
   * 2. Only Checkout Completed
   * ========================================
   */

  if (
    event.type !==
    "checkout.session.completed"
  ) {
    return NextResponse.json({
      received:
        true,
    });
  }


  const session =
    event.data.object;


  const orderId =
    session.metadata
      ?.orderId;


  const paymentIntentId =
    typeof session.payment_intent ===
    "string"
      ? session.payment_intent
      : session.payment_intent
          ?.id ??
        null;


  if (!orderId) {
    console.error(
      "Stripe webhook: missing orderId"
    );


    return NextResponse.json(
      {
        error:
          "缺少 orderId",
      },
      {
        status:
          400,
      }
    );
  }


  /*
   * ========================================
   * 3. Checkout completed != paid
   * ========================================
   */

  if (
    session.payment_status !==
    "paid"
  ) {
    console.log(
      `Stripe session ${session.id} completed but payment_status is ${session.payment_status}`
    );


    return NextResponse.json({
      received:
        true,
    });
  }


  /*
   * ========================================
   * 4. Supabase Admin
   * ========================================
   */

  const supabaseAdmin =
    createClient(
      process.env
        .NEXT_PUBLIC_SUPABASE_URL!,

      process.env
        .SUPABASE_SECRET_KEY!
    );


  /*
   * ========================================
   * 5. Event Idempotency
   * ========================================
   */

  const {
    data:
      existingTransaction,

    error:
      existingTransactionError,
  } =
    await supabaseAdmin
      .from(
        "payment_transactions"
      )
      .select(
        "id"
      )
      .eq(
        "provider",
        "stripe"
      )
      .eq(
        "provider_event_id",
        event.id
      )
      .maybeSingle();


  if (
    existingTransactionError
  ) {
    console.error(
      "Stripe transaction idempotency check failed"
    );


    return NextResponse.json(
      {
        error:
          "檢查支付交易記錄失敗",
      },
      {
        status:
          500,
      }
    );
  }


  /*
   * Stripe Webhook retry：
   *
   * Payment 已经处理过时，
   * 仍然尝试建立 payment_confirmed 通知。
   *
   * Notification 自身具有
   * payment_confirmed:<orderId>
   * 幂等保护，不会重复产生。
   */

  if (
    existingTransaction
  ) {
    console.log(
      `Stripe event ${event.id} already processed`
    );

    await safeEnsureOrderWorkspace(
      orderId
    );


    await createOrderNotification({
      orderId,

      type:
        "payment_confirmed",

      title:
        "付款已经确认",

      message:
        "您的付款已经确认。我们将按照服务要求检查资料，并开始后续办理流程。",

      idempotencyKey:
        `payment_confirmed:${orderId}`,

      metadata: {
        provider:
          "stripe",

        providerEventId:
          event.id,

        providerSessionId:
          session.id,

        providerPaymentId:
          paymentIntentId,
      },
    });


    return NextResponse.json({
      received:
        true,

      alreadyProcessed:
        true,
    });
  }


  /*
   * ========================================
   * 6. Read Order
   * ========================================
   */

  const {
    data:
      order,

    error:
      orderError,
  } =
    await supabaseAdmin
      .from(
        "orders"
      )
      .select(`
        id,
        amount,
        currency,
        payment_status,
        payment_method,
        payment_provider
      `)
      .eq(
        "id",
        orderId
      )
      .single();


  if (
    orderError ||
    !order
  ) {
    console.error(
      "Stripe webhook: order lookup failed"
    );


    return NextResponse.json(
      {
        error:
          "找不到訂單",
      },
      {
        status:
          404,
      }
    );
  }


  /*
   * ========================================
   * 7. Already Paid
   * ========================================
   *
   * 即使订单已经 paid，
   * 也补做幂等 Notification。
   */

  if (
    order.payment_status ===
    "paid"
  ) {
    console.log(
      `Order ${orderId} already paid`
    );

    await safeEnsureOrderWorkspace(
      orderId
    );


    await createOrderNotification({
      orderId,

      type:
        "payment_confirmed",

      title:
        "付款已经确认",

      message:
        "您的付款已经确认。我们将按照服务要求检查资料，并开始后续办理流程。",

      idempotencyKey:
        `payment_confirmed:${orderId}`,

      metadata: {
        provider:
          "stripe",

        providerEventId:
          event.id,

        providerSessionId:
          session.id,

        providerPaymentId:
          paymentIntentId,
      },
    });


    return NextResponse.json({
      received:
        true,

      alreadyPaid:
        true,
    });
  }


  /*
   * ========================================
   * 8. Provider / Method Validation
   * ========================================
   */

  if (
    order.payment_provider !==
      "stripe" ||
    order.payment_method !==
      "card"
  ) {
    console.error(
      "Stripe webhook: payment provider mismatch",
      {
        orderId,

        paymentProvider:
          order.payment_provider,

        paymentMethod:
          order.payment_method,
      }
    );


    return NextResponse.json(
      {
        error:
          "訂單付款方式不匹配",
      },
      {
        status:
          400,
      }
    );
  }


  /*
   * ========================================
   * 9. Amount Validation
   * ========================================
   */

  if (
    order.amount ===
      null ||
    order.amount ===
      undefined
  ) {
    return NextResponse.json(
      {
        error:
          "訂單金額不存在",
      },
      {
        status:
          400,
      }
    );
  }


  const expectedAmount =
    Math.round(
      Number(
        order.amount
      ) *
      100
    );


  if (
    session.amount_total !==
    expectedAmount
  ) {
    console.error(
      "Stripe webhook: amount mismatch",
      {
        orderId,

        stripeAmount:
          session.amount_total,

        expectedAmount,
      }
    );


    return NextResponse.json(
      {
        error:
          "付款金額不匹配",
      },
      {
        status:
          400,
      }
    );
  }


  /*
   * ========================================
   * 10. Currency Validation
   * ========================================
   */

  if (!order.currency) {
    return NextResponse.json(
      {
        error:
          "訂單幣種不存在",
      },
      {
        status:
          400,
      }
    );
  }


  const expectedCurrency =
    order.currency
      .toLowerCase();


  if (
    session.currency !==
    expectedCurrency
  ) {
    console.error(
      "Stripe webhook: currency mismatch",
      {
        orderId,

        stripeCurrency:
          session.currency,

        expectedCurrency,
      }
    );


    return NextResponse.json(
      {
        error:
          "付款幣種不匹配",
      },
      {
        status:
          400,
      }
    );
  }


  /*
   * ========================================
   * 11. Stripe Payment Data
   * ========================================
   */

  if (
    session.amount_total ===
      null ||
    !session.currency
  ) {
    return NextResponse.json(
      {
        error:
          "Stripe 付款資料不完整",
      },
      {
        status:
          400,
      }
    );
  }


  /*
   * ========================================
   * 12. Atomic Payment Confirmation
   * ========================================
   */

  const {
    error:
      confirmPaymentError,
  } =
    await supabaseAdmin.rpc(
      "confirm_payment_transaction",
      {
        p_order_id:
          orderId,

        p_provider:
          "stripe",

        p_provider_event_id:
          event.id,

        p_provider_session_id:
          session.id,

        p_provider_payment_id:
          paymentIntentId,

        p_amount:
          Number(
            session.amount_total
          ) /
          100,

        p_currency:
          session.currency
            .toUpperCase(),
      }
    );


  if (
    confirmPaymentError
  ) {
    console.error(
      "Stripe payment confirmation failed"
    );


    return NextResponse.json(
      {
        error:
          "確認支付交易失敗",
      },
      {
        status:
          500,
      }
    );
  }

  await safeEnsureOrderWorkspace(
    orderId
  );


  console.log(
    `Order ${orderId} verified and confirmed atomically`
  );


  /*
   * ========================================
   * 13. Customer Notification
   * ========================================
   *
   * Payment 已经完成数据库原子确认以后
   * 才建立客户通知。
   *
   * createOrderNotification()
   * 最终使用 safeCreateNotification()，
   * 因此通知失败不会让付款 Webhook 失败。
   */

  await createOrderNotification({
    orderId,

    type:
      "payment_confirmed",

    title:
      "付款已经确认",

    message:
      "您的付款已经确认。我们将按照服务要求检查资料，并开始后续办理流程。",

    idempotencyKey:
      `payment_confirmed:${orderId}`,

    metadata: {
      provider:
        "stripe",

      providerEventId:
        event.id,

      providerSessionId:
        session.id,

      providerPaymentId:
        paymentIntentId,
    },
  });


  return NextResponse.json({
    received:
      true,

    confirmed:
      true,
  });
}