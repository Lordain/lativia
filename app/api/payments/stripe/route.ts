import { NextResponse } from "next/server";

import { stripe } from "@/lib/payments/stripe";
import { createClient } from "@/lib/supabase/server";

import {
  checkPaymentCheckoutRateLimit,
} from "@/lib/payments/checkPaymentCheckoutRateLimit";

export async function POST(
  request: Request
) {
  try {
    const { orderId } =
      await request.json();

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

    const supabase =
      await createClient();

    const {
      data: { user },
      error: userError,
    } =
      await supabase.auth.getUser();

    if (
      userError ||
      !user
    ) {
      return NextResponse.json(
        {
          error: "请先登录",
        },
        {
          status: 401,
        }
      );
    }

    const {
      data: order,
      error: orderError,
    } = await supabase
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

    if (
      orderError ||
      !order
    ) {
      return NextResponse.json(
        {
          error: "订单不存在",
        },
        {
          status: 404,
        }
      );
    }

    // Supabase relationship 可能被推断为数组，
    // 这里统一转换成单个 service 对象。
    const service =
      Array.isArray(
        order.services
      )
        ? order.services[0] ??
          null
        : order.services;

    if (
      order.payment_provider !==
      "stripe"
    ) {
      return NextResponse.json(
        {
          error:
            "此订单不是 Stripe 付款",
        },
        {
          status: 400,
        }
      );
    }

    if (
      order.payment_method !==
      "card"
    ) {
      return NextResponse.json(
        {
          error:
            "此订单不是信用卡付款",
        },
        {
          status: 400,
        }
      );
    }

    if (
      order.payment_status ===
      "paid"
    ) {
      return NextResponse.json(
        {
          error:
            "此订单已经完成付款",
        },
        {
          status: 400,
        }
      );
    }

    if (
      order.amount === null ||
      order.amount === undefined
    ) {
      return NextResponse.json(
        {
          error:
            "订单金额资料不完整",
        },
        {
          status: 400,
        }
      );
    }

    if (!order.currency) {
      return NextResponse.json(
        {
          error:
            "订单币种资料不完整",
        },
        {
          status: 400,
        }
      );
    }

    const rateLimit =
      await checkPaymentCheckoutRateLimit({
        userId:
          user.id,

        orderId:
          order.id,

        provider:
          "stripe",
      });


    if (
      !rateLimit.allowed
    ) {
      return NextResponse.json(
        {
          error:
            "付款请求过于频繁，请稍后再试。",
        },
        {
          status:
            429,

          headers: {
            "Retry-After":
              String(
                rateLimit.retryAfterSeconds ??
                  60
              ),
          },
        }
      );
    }

    const siteUrl =
      process.env
        .NEXT_PUBLIC_SITE_URL;

    if (!siteUrl) {
      return NextResponse.json(
        {
          error:
            "网站地址尚未配置",
        },
        {
          status: 500,
        }
      );
    }

    const session =
      await stripe.checkout.sessions.create({
        mode:
          "payment",

        payment_method_types: [
          "card",
        ],

        line_items: [
          {
            price_data: {
              currency:
                order.currency.toLowerCase(),

              product_data: {
                name:
                  service?.title ??
                  "服务订单",
              },

              unit_amount:
                Math.round(
                  Number(
                    order.amount
                  ) * 100
                ),
            },

            quantity:
              1,
          },
        ],

        metadata: {
          orderId:
            order.id,
        },

        success_url:
          `${siteUrl}/account/orders/${order.id}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${siteUrl}/account/orders/${order.id}/payment`,
      });

    if (!session.url) {
      return NextResponse.json(
        {
          error:
            "Stripe 未返回付款网址",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      checkoutUrl:
        session.url,

      sessionId:
        session.id,
    });
  } catch (error) {
    console.error(
      "Stripe Checkout error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "建立 Stripe 付款失败",
      },
      {
        status: 500,
      }
    );
  }
}