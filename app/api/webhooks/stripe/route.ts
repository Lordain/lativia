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
      { error: "缺少 Stripe signature" },
      { status: 400 }
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
        error:
          "Webhook signature 驗證失敗",
      },
      { status: 400 }
    );
  }

  if (
    event.type ===
    "checkout.session.completed"
  ) {
    const session = event.data.object;
  
    const orderId =
      session.metadata?.orderId;
  
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;
  
    if (!orderId) {
      return NextResponse.json(
        { error: "缺少 orderId" },
        { status: 400 }
      );
    }
  
    if (
      session.payment_status !== "paid"
    ) {
      return NextResponse.json({
        received: true,
      });
    }
  
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );
  
    // 1. 先检查 Stripe event 是否已经处理过
    const {
      data: existingTransaction,
      error: existingTransactionError,
    } = await supabaseAdmin
      .from("payment_transactions")
      .select("id")
      .eq("provider", "stripe")
      .eq("provider_event_id", event.id)
      .maybeSingle();
  
    if (existingTransactionError) {
      console.error(
        "Check existing transaction error:",
        existingTransactionError
      );
  
      return NextResponse.json(
        {
          error:
            "检查支付交易记录失败",
        },
        { status: 500 }
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
  
    // 2. 查询订单
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
        { error: "找不到订单" },
        { status: 404 }
      );
    }
  
    // 3. 已经付款则直接结束
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
  
    // 4. Provider 验证
    if (
      order.payment_provider !== "stripe" ||
      order.payment_method !== "card"
    ) {
      return NextResponse.json(
        {
          error:
            "订单付款方式不匹配",
        },
        { status: 400 }
      );
    }
  
    // 5. 金额验证
    const expectedAmount =
      Math.round(
        Number(order.amount) * 100
      );
  
    if (
      session.amount_total !==
      expectedAmount
    ) {
      return NextResponse.json(
        {
          error:
            "付款金额不匹配",
        },
        { status: 400 }
      );
    }
  
    // 6. 币种验证
    const expectedCurrency =
      order.currency.toLowerCase();
  
    if (
      session.currency !==
      expectedCurrency
    ) {
      return NextResponse.json(
        {
          error:
            "付款币种不匹配",
        },
        { status: 400 }
      );
    }
  
    // 7. 建立 payment transaction
    const {
      error: transactionError,
    } = await supabaseAdmin
      .from("payment_transactions")
      .insert({
        order_id: orderId,
  
        provider: "stripe",
  
        provider_event_id: event.id,
        provider_session_id: session.id,
        provider_payment_id:
          paymentIntentId,
  
        amount:
          Number(session.amount_total) / 100,
  
        currency:
          session.currency?.toUpperCase(),
  
        status: "paid",
      });
  
    if (transactionError) {
      console.error(
        "Create payment transaction error:",
        transactionError
      );
  
      return NextResponse.json(
        {
          error:
            "建立支付交易记录失败",
        },
        { status: 500 }
      );
    }
  
    // 8. 最后更新订单
    const { error: updateError } =
      await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "paid",
          paid_at:
            new Date().toISOString(),
        })
        .eq("id", orderId);
  
    if (updateError) {
      console.error(
        "Update order payment error:",
        updateError
      );
  
      return NextResponse.json(
        {
          error:
            "更新订单付款状态失败",
        },
        { status: 500 }
      );
    }
  
    console.log(
      `Order ${orderId} verified and marked as paid`
    );
  }

  return NextResponse.json({
    received: true,
  });
}