import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { stripe } from "@/lib/payments/stripe";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { createPaymentAuditLog } from "@/lib/payments/createPaymentAuditLog";

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

    // 1. 确认当前登录用户是 Admin
    const profile =
      await getCurrentProfile();

    if (
      !profile ||
      profile.role !== "admin"
    ) {
      return NextResponse.json(
        {
          error: "无权限执行此操作",
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

    // 3. 查询订单
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
          error: "找不到订单",
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
            "此订单不是 Stripe 卡片付款",
        },
        {
          status: 400,
        }
      );
    }

    // 4. 查找最近一笔 Stripe transaction
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
            "找不到 Stripe 支付交易记录",
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

    // 5. 向 Stripe 重新查询
    const session =
      await stripe.checkout.sessions.retrieve(
        transaction.provider_session_id
      );

    // 6. Order ID 验证
    const stripeOrderId =
      session.metadata?.orderId;

    if (stripeOrderId !== order.id) {
      await createPaymentAuditLog(
        supabaseAdmin,
        {
          orderId: order.id,
          adminUserId: profile.id,
          action: "reverify",
          provider: "stripe",
          result: "blocked",
          message:
            "Stripe Session 的 Order ID 与系统订单不一致。",
          metadata: {
            stripeOrderId,
            orderId: order.id,
            sessionId: session.id,
          },
        }
      );

      return NextResponse.json(
        {
          success: false,
          canRepair: false,
          message:
            "Stripe Session 的 Order ID 与系统订单不一致。",
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
      await createPaymentAuditLog(
        supabaseAdmin,
        {
          orderId: order.id,
          adminUserId: profile.id,
          action: "reverify",
          provider: "stripe",
          result: "blocked",
          message:
            "Stripe 当前并未确认此付款为 paid。",
          metadata: {
            stripePaymentStatus:
              session.payment_status,
            sessionId: session.id,
          },
        }
      );

      return NextResponse.json({
        success: true,
        canRepair: false,
        message:
          "Stripe 当前并未确认此付款为 paid。",
        stripePaymentStatus:
          session.payment_status,
      });
    }

    if (
      session.amount_total === null ||
      !session.currency
    ) {
      await createPaymentAuditLog(
        supabaseAdmin,
        {
          orderId: order.id,
          adminUserId: profile.id,
          action: "reverify",
          provider: "stripe",
          result: "blocked",
          message:
            "Stripe Session 金额或币种资料不完整。",
          metadata: {
            sessionId: session.id,
          },
        }
      );

      return NextResponse.json(
        {
          success: false,
          canRepair: false,
          message:
            "Stripe Session 金额或币种资料不完整。",
        },
        {
          status: 409,
        }
      );
    }

    // 8. 金额验证
    const expectedAmount =
      Math.round(
        Number(order.amount) * 100
      );

    if (
      session.amount_total !==
      expectedAmount
    ) {
      await createPaymentAuditLog(
        supabaseAdmin,
        {
          orderId: order.id,
          adminUserId: profile.id,
          action: "reverify",
          provider: "stripe",
          result: "blocked",
          message:
            "Stripe 金额与订单金额不一致。",
          metadata: {
            stripeAmount:
              session.amount_total / 100,
            orderAmount:
              Number(order.amount),
            sessionId: session.id,
          },
        }
      );

      return NextResponse.json(
        {
          success: false,
          canRepair: false,
          message:
            "Stripe 金额与订单金额不一致。",
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

    // 9. 币种验证
    const expectedCurrency =
      order.currency?.toLowerCase();

    if (
      session.currency !==
      expectedCurrency
    ) {
      await createPaymentAuditLog(
        supabaseAdmin,
        {
          orderId: order.id,
          adminUserId: profile.id,
          action: "reverify",
          provider: "stripe",
          result: "blocked",
          message:
            "Stripe 币种与订单币种不一致。",
          metadata: {
            stripeCurrency:
              session.currency,
            orderCurrency:
              order.currency,
            sessionId: session.id,
          },
        }
      );

      return NextResponse.json(
        {
          success: false,
          canRepair: false,
          message:
            "Stripe 币种与订单币种不一致。",
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

    // 10. 验证全部成功，写入 Audit Log
    await createPaymentAuditLog(
      supabaseAdmin,
      {
        orderId: order.id,

        adminUserId:
          profile.id,

        action:
          "reverify",

        provider:
          "stripe",

        result:
          "success",

        message:
          "Stripe 付款重新验证成功。",

        metadata: {
          stripePaymentStatus:
            session.payment_status,

          stripeAmount:
            session.amount_total / 100,

          stripeCurrency:
            session.currency,

          sessionId:
            session.id,

          paymentIntentId:
            transaction.provider_payment_id,
        },
      }
    );

    return NextResponse.json({
      success: true,
      canRepair: true,
      message:
        "Stripe 验证成功，此付款可以安全修复。",
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
          "Stripe 重新验证失败",
      },
      {
        status: 500,
      }
    );
  }
}