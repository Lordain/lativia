import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "@/lib/payments/stripe";
import { createClient } from "@supabase/supabase-js";

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
      { error: "Webhook signature 驗證失敗" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const orderId =
      session.metadata?.orderId;

    if (!orderId) {
      return NextResponse.json(
        { error: "缺少 orderId" },
        { status: 400 }
      );
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json({
        received: true,
      });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: "paid",
        paid_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (error) {
      console.error(
        "Update order payment error:",
        error
      );

      return NextResponse.json(
        { error: "更新訂單付款狀態失敗" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    received: true,
  });
}