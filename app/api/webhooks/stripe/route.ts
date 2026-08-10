import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

import { stripe } from "@/lib/payments/stripe";

export async function POST(request: Request) {
  const body = await request.text();

  const headerList = await headers();
  const signature =
    headerList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      {
        error: "缺少 Stripe signature",
      },
      {
        status: 400,
      }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error(
      "Stripe webhook signature error:",
      error
    );

    return NextResponse.json(
      {
        error: "Webhook signature 驗證失敗",
      },
      {
        status: 400,
      }
    );
  }

  // 目前只處理 Checkout 完成事件
  if (
    event.type !==
    "checkout.session.completed"
  ) {
    return NextResponse.json({
      received: true,
    });
  }

  const session = event.data.object;

  const orderId =
    session.metadata?.orderId;

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  if (!orderId) {
    console.error(
      "Stripe webhook: missing orderId"
    );

    return NextResponse.json(
      {
        error: "缺少 orderId",
      },
      {
        status: 400,
      }
    );
  }

  // Checkout 完成不一定代表款項已支付
  if (
    session.payment_status !== "paid"
  ) {
    console.log(
      `Stripe session ${session.id} completed but payment_status is ${session.payment_status}`
    );

    return NextResponse.json({
      received: true,
    });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  // 1. 檢查此 Stripe event 是否已處理
  const {
    data: existingTransaction,
    error: existingTransactionError,
  } = await supabaseAdmin
    .from("payment_transactions")
    .select("id")
    .eq("provider", "stripe")
    .eq(
      "provider_event_id",
      event.id
    )
    .maybeSingle();

  if (existingTransactionError) {
    console.error(
      "Check existing transaction error:",
      existingTransactionError
    );

    return NextResponse.json(
      {
        error: "檢查支付交易記錄失敗",
      },
      {
        status: 500,
      }
    );
  }

  if (existingTransaction) {
    console.log(
      `Stripe event ${event.id} already processed`
    );

    return NextResponse.json({
      received: true,
    });
  }

  // 2. 查詢訂單
  const {
    data: order,
    error: orderError,
  } = await supabaseAdmin
    .from("orders")
    .select(`
      id,
      amount,
      currency,
      payment_status,
      payment_method,
      payment_provider
    `)
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    console.error(
      "Stripe webhook: order not found",
      orderError
    );

    return NextResponse.json(
      {
        error: "找不到訂單",
      },
      {
        status: 404,
      }
    );
  }

  // 3. 已付款則直接結束
  if (
    order.payment_status === "paid"
  ) {
    console.log(
      `Order ${orderId} already paid`
    );

    return NextResponse.json({
      received: true,
    });
  }

  // 4. 驗證 Provider / Method
  if (
    order.payment_provider !== "stripe" ||
    order.payment_method !== "card"
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
        error: "訂單付款方式不匹配",
      },
      {
        status: 400,
      }
    );
  }

  // 5. 驗證訂單金額存在
  if (
    order.amount === null ||
    order.amount === undefined
  ) {
    return NextResponse.json(
      {
        error: "訂單金額不存在",
      },
      {
        status: 400,
      }
    );
  }

  // 6. 驗證 Stripe 金額
  const expectedAmount =
    Math.round(
      Number(order.amount) * 100
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
        error: "付款金額不匹配",
      },
      {
        status: 400,
      }
    );
  }

  // 7. 驗證幣種
  if (!order.currency) {
    return NextResponse.json(
      {
        error: "訂單幣種不存在",
      },
      {
        status: 400,
      }
    );
  }

  const expectedCurrency =
    order.currency.toLowerCase();

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
        error: "付款幣種不匹配",
      },
      {
        status: 400,
      }
    );
  }

  // 8. Stripe session 金額與幣種也必須存在
  if (
    session.amount_total === null ||
    !session.currency
  ) {
    return NextResponse.json(
      {
        error: "Stripe 付款資料不完整",
      },
      {
        status: 400,
      }
    );
  }

  // 9. 原子化確認付款
  const {
    error: confirmPaymentError,
  } = await supabaseAdmin.rpc(
    "confirm_payment_transaction",
    {
      p_order_id: orderId,

      p_provider: "stripe",

      p_provider_event_id:
        event.id,

      p_provider_session_id:
        session.id,

      p_provider_payment_id:
        paymentIntentId,

      p_amount:
        Number(
          session.amount_total
        ) / 100,

      p_currency:
        session.currency.toUpperCase(),
    }
  );

  if (confirmPaymentError) {
    console.error(
      "Confirm payment transaction error:",
      confirmPaymentError
    );

    return NextResponse.json(
      {
        error: "確認支付交易失敗",
      },
      {
        status: 500,
      }
    );
  }

  console.log(
    `Order ${orderId} verified and confirmed atomically`
  );

  return NextResponse.json({
    received: true,
  });
}