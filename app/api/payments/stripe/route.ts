import { NextResponse } from "next/server";

import { stripe } from "@/lib/payments/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "缺少 orderId" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "請先登入" },
        { status: 401 }
      );
    }

    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        id,
        user_id,
        amount,
        currency,
        payment_status,
        payment_method,
        payment_provider,
        services (
          title
        )
      `)
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: "訂單不存在" },
        { status: 404 }
      );
    }

    if (order.payment_provider !== "stripe") {
      return NextResponse.json(
        { error: "此訂單不是 Stripe 付款訂單" },
        { status: 400 }
      );
    }

    if (order.payment_method !== "card") {
      return NextResponse.json(
        { error: "此訂單不是信用卡付款" },
        { status: 400 }
      );
    }

    if (order.payment_status === "paid") {
      return NextResponse.json(
        { error: "此訂單已完成付款" },
        { status: 400 }
      );
    }

    if (!order.amount || !order.currency) {
      return NextResponse.json(
        { error: "訂單金額資料不完整" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: order.currency.toLowerCase(),

            product_data: {
              name:
                order.services?.title ??
                "服務訂單",
            },

            unit_amount:
              Math.round(
                Number(order.amount) * 100
              ),
          },

          quantity: 1,
        },
      ],

      success_url:
        `${process.env.NEXT_PUBLIC_SITE_URL}` +
        `/account/orders/${order.id}/payment/success` +
        `?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url:
        `${process.env.NEXT_PUBLIC_SITE_URL}` +
        `/account/orders/${order.id}/payment`,

      metadata: {
        orderId: order.id,
        userId: user.id,
      },

      client_reference_id: order.id,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe 未返回付款網址" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      checkoutUrl: session.url,
    });
  } catch (error) {
    console.error("Stripe Checkout error:", error);

    return NextResponse.json(
      { error: "建立 Stripe 付款失敗" },
      { status: 500 }
    );
  }
}