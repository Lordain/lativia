import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { stripe } from "@/lib/payments/stripe";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { createPaymentAuditLog } from "@/lib/payments/createPaymentAuditLog";

import {
  safeEnsureOrderWorkspace,
} from "@/lib/workspaces/safeEnsureOrderWorkspace";

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

    // 1. Admin 权限检查
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

    // 2. Server Admin Client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );

    // 3. 查订单
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

    if (
      order.payment_status === "paid"
    ) {
      /*
       * Order 已经 paid，
       * 但可能因为历史异常缺少 Workspace。
       *
       * ensure 本身幂等，
       * 非 Workspace Service 会自动跳过。
       */
      await safeEnsureOrderWorkspace(
        order.id
      );
    
      return NextResponse.json({
        success: true,
    
        message:
          "订单当前已经是已付款状态，无需修复。",
      });
    }

    // 4. 找最近一笔 paid Stripe transaction
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
      .eq("status", "paid")
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
            "找不到已付款的 Stripe 交易记录",
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

    // 5. 重新向 Stripe 查询
    const session =
      await stripe.checkout.sessions.retrieve(
        transaction.provider_session_id
      );

    // 6. Stripe Order ID 验证
    if (
      session.metadata?.orderId !==
      order.id
    ) {
      await createPaymentAuditLog(
        supabaseAdmin,
        {
          orderId: order.id,

          adminUserId:
            profile.id,

          action:
            "repair",

          provider:
            "stripe",

          result:
            "blocked",

          message:
            "安全修复被阻止：Stripe Session 的订单 ID 不匹配。",

          metadata: {
            stripeOrderId:
              session.metadata?.orderId ??
              null,

            orderId:
              order.id,

            sessionId:
              session.id,
          },
        }
      );

      return NextResponse.json(
        {
          error:
            "Stripe Session 的订单 ID 不匹配",
        },
        {
          status: 409,
        }
      );
    }

    // 7. Stripe 必须真的 paid
    if (
      session.payment_status !== "paid"
    ) {
      await createPaymentAuditLog(
        supabaseAdmin,
        {
          orderId: order.id,

          adminUserId:
            profile.id,

          action:
            "repair",

          provider:
            "stripe",

          result:
            "blocked",

          message:
            "安全修复被阻止：Stripe 当前未确认付款为 paid。",

          metadata: {
            stripePaymentStatus:
              session.payment_status,

            sessionId:
              session.id,
          },
        }
      );

      return NextResponse.json(
        {
          error:
            "Stripe 当前未确认此付款为 paid",
        },
        {
          status: 409,
        }
      );
    }

    if (
      session.amount_total === null ||
      !session.currency
    ) {
      await createPaymentAuditLog(
        supabaseAdmin,
        {
          orderId: order.id,

          adminUserId:
            profile.id,

          action:
            "repair",

          provider:
            "stripe",

          result:
            "blocked",

          message:
            "安全修复被阻止：Stripe 付款资料不完整。",

          metadata: {
            sessionId:
              session.id,

            amountTotal:
              session.amount_total,

            currency:
              session.currency,
          },
        }
      );

      return NextResponse.json(
        {
          error:
            "Stripe 付款资料不完整",
        },
        {
          status: 409,
        }
      );
    }

    // 8. Order 金额验证
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

          adminUserId:
            profile.id,

          action:
            "repair",

          provider:
            "stripe",

          result:
            "blocked",

          message:
            "安全修复被阻止：Stripe 金额与订单金额不一致。",

          metadata: {
            stripeAmount:
              session.amount_total /
              100,

            orderAmount:
              Number(order.amount),

            sessionId:
              session.id,
          },
        }
      );

      return NextResponse.json(
        {
          error:
            "Stripe 金额与订单金额不一致",
        },
        {
          status: 409,
        }
      );
    }

    // 9. Transaction 金额也必须匹配
    if (
      Number(transaction.amount) !==
      Number(order.amount)
    ) {
      await createPaymentAuditLog(
        supabaseAdmin,
        {
          orderId: order.id,

          adminUserId:
            profile.id,

          action:
            "repair",

          provider:
            "stripe",

          result:
            "blocked",

          message:
            "安全修复被阻止：支付交易金额与订单金额不一致。",

          metadata: {
            transactionAmount:
              Number(
                transaction.amount
              ),

            orderAmount:
              Number(order.amount),

            transactionId:
              transaction.id,
          },
        }
      );

      return NextResponse.json(
        {
          error:
            "支付交易金额与订单金额不一致",
        },
        {
          status: 409,
        }
      );
    }

    // 10. Stripe 币种验证
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

          adminUserId:
            profile.id,

          action:
            "repair",

          provider:
            "stripe",

          result:
            "blocked",

          message:
            "安全修复被阻止：Stripe 币种与订单币种不一致。",

          metadata: {
            stripeCurrency:
              session.currency,

            orderCurrency:
              order.currency,

            sessionId:
              session.id,
          },
        }
      );

      return NextResponse.json(
        {
          error:
            "Stripe 币种与订单币种不一致",
        },
        {
          status: 409,
        }
      );
    }

    // 11. Transaction 币种也必须匹配
    if (
      transaction.currency !==
      order.currency
    ) {
      await createPaymentAuditLog(
        supabaseAdmin,
        {
          orderId: order.id,

          adminUserId:
            profile.id,

          action:
            "repair",

          provider:
            "stripe",

          result:
            "blocked",

          message:
            "安全修复被阻止：支付交易币种与订单币种不一致。",

          metadata: {
            transactionCurrency:
              transaction.currency,

            orderCurrency:
              order.currency,

            transactionId:
              transaction.id,
          },
        }
      );

      return NextResponse.json(
        {
          error:
            "支付交易币种与订单币种不一致",
        },
        {
          status: 409,
        }
      );
    }

    // 12. 所有验证通过，调用修复 RPC
    const {
      error: repairError,
    } = await supabaseAdmin.rpc(
      "repair_paid_order",
      {
        p_order_id:
          order.id,

        p_provider:
          "stripe",

        p_provider_session_id:
          transaction.provider_session_id,
      }
    );

    if (repairError) {
      console.error(
        "Repair paid order error:",
        repairError
      );

      return NextResponse.json(
        {
          error:
            "修复订单付款状态失败",
        },
        {
          status: 500,
        }
      );
    }

    /*
    * ========================================
    * Workspace Recovery
    * ========================================
    *
    * Payment 修复已经成功。
    * 现在补建需要的 Workspace。
    *
    * Workspace 创建失败不能让已经完成的
    * Payment Repair 显示为失败。
    */

    await safeEnsureOrderWorkspace(
      order.id
    );

    // 13. 成功 Audit Log
    await createPaymentAuditLog(
      supabaseAdmin,
      {
        orderId:
          order.id,

        adminUserId:
          profile.id,

        action:
          "repair",

        provider:
          "stripe",

        result:
          "success",

        message:
          "Stripe 付款状态已安全修复。",

        metadata: {
          sessionId:
            session.id,

          paymentIntentId:
            transaction.provider_payment_id,

          transactionId:
            transaction.id,

          amount:
            Number(
              transaction.amount
            ),

          currency:
            transaction.currency,
        },
      }
    );

    return NextResponse.json({
      success: true,

      message:
        "Stripe 付款已重新验证，订单付款状态已安全修复。",
    });
  } catch (error) {
    console.error(
      "Stripe repair error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Stripe 付款修复失败",
      },
      {
        status: 500,
      }
    );
  }
}