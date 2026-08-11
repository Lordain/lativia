import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { stripe } from "@/lib/payments/stripe";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        {
          error: "缺少 orderId",
        },
        {
          status: 400,
        }
      );
    }

    // 1. 確認目前登入者是 Admin
    const profile =
      await getCurrentProfile();

    if (
      !profile ||
      profile.role !== "admin"
    ) {
      return NextResponse.json(
        {
          error: "無權限執行此操作",
        },
        {
          status: 403,
        }
      );
    }

    // 2. Admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );

    // 3. 查 Order
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
      return NextResponse.json(
        {
          error: "找不到訂單",
        },
        {
          status: 404,
        }
      );
    }

    if (
      order.payment_provider !== "stripe" ||
      order.payment_method !== "card"
    ) {
      return NextResponse.json(
        {
          error:
            "此訂單不是 Stripe 卡片付款",
        },
        {
          status: 400,
        }
      );
    }

    // 4. 找最近 Stripe transaction
    const {
      data: transaction,
      error: transactionError,
    } = await supabaseAdmin
      .from("payment_transactions")
      .select(`
        id,
        provider,
        provider_event_id,
        provider_session_id,
        provider_payment_id,
        amount,
        currency,
        status
      `)
      .eq("order_id", orderId)
      .eq("provider", "stripe")
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (
      transactionError ||
      !transaction
    ) {
      return NextResponse.json(
        {
          error:
            "找不到 Stripe 支付交易紀錄",
        },
        {
          status: 404,
        }
      );
    }

    if (
      !transaction.provider_session_id
    ) {
      return NextResponse.json(
        {
          error:
            "交易缺少 Stripe Checkout Session ID",
        },
        {
          status: 400,
        }
      );
    }

    // 5. 向 Stripe 重新查詢
    const session =
      await stripe.checkout.sessions.retrieve(
        transaction.provider_session_id
      );

    // 6. Order ID 驗證
    const stripeOrderId =
      session.metadata?.orderId;

    if (stripeOrderId !== order.id) {
      return NextResponse.json(
        {
          success: false,
          canRepair: false,
          message:
            "Stripe Session 的 Order ID 與系統訂單不一致。",
        },
        {
          status: 409,
        }
      );
    }

    // 7. Stripe Payment Status
    if (
      session.payment_status !== "paid"
    ) {
      return NextResponse.json({
        success: true,
        canRepair: false,
        message:
          "Stripe 目前並未確認此付款為 paid。",
        stripePaymentStatus:
          session.payment_status,
      });
    }

    if (
      session.amount_total === null ||
      !session.currency
    ) {
      return NextResponse.json(
        {
          success: false,
          canRepair: false,
          message:
            "Stripe Session 金額或幣種資料不完整。",
        },
        {
          status: 409,
        }
      );
    }

    // 8. 金額驗證
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
          success: false,
          canRepair: false,
          message:
            "Stripe 金額與訂單金額不一致。",
          stripeAmount:
            session.amount_total / 100,
          orderAmount:
            Number(order.amount),
        },
        {
          status: 409,
        }
      );
    }

    // 9. 幣種驗證
    const expectedCurrency =
      order.currency?.toLowerCase();

    if (
      session.currency !==
      expectedCurrency
    ) {
      return NextResponse.json(
        {
          success: false,
          canRepair: false,
          message:
            "Stripe 幣種與訂單幣種不一致。",
          stripeCurrency:
            session.currency,
          orderCurrency:
            order.currency,
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json({
      success: true,
      canRepair: true,
      message:
        "Stripe 驗證成功，此付款可以安全修復。",
      stripePaymentStatus:
        session.payment_status,
      stripeAmount:
        session.amount_total / 100,
      stripeCurrency:
        session.currency.toUpperCase(),
      orderAmount:
        Number(order.amount),
      orderCurrency:
        order.currency,
    });
  } catch (error) {
    console.error(
      "Stripe re-verification error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Stripe 重新驗證失敗",
      },
      {
        status: 500,
      }
    );
  }
}