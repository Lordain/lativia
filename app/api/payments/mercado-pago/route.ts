import { NextResponse } from "next/server";
import { Preference } from "mercadopago";

import { mercadoPagoClient } from "@/lib/payments/mercadoPago";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request
) {
  try {
    // ========================================
    // 1. 获取 Order ID
    // ========================================

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

    // ========================================
    // 2. 获取当前登录用户
    // ========================================

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

    // ========================================
    // 3. 查询订单
    // ========================================

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
      .eq(
        "id",
        orderId
      )
      .eq(
        "user_id",
        user.id
      )
      .single();

    if (
      orderError ||
      !order
    ) {
      console.error(
        "Mercado Pago order error:",
        orderError
      );

      return NextResponse.json(
        {
          error: "订单不存在",
        },
        {
          status: 404,
        }
      );
    }

    // ========================================
    // 4. 验证 Payment Provider
    // ========================================

    if (
      order.payment_provider !==
      "mercado_pago"
    ) {
      return NextResponse.json(
        {
          error:
            "此订单不是 Mercado Pago 付款",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================
    // 5. 验证 Payment Method
    // ========================================

    if (
      order.payment_method !==
      "local_payment"
    ) {
      return NextResponse.json(
        {
          error:
            "此订单不是墨西哥本地付款",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================
    // 6. Mercado Pago 必须使用 MXN
    // ========================================

    if (
      order.currency !==
      "MXN"
    ) {
      return NextResponse.json(
        {
          error:
            "Mercado Pago 订单必须使用 MXN",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================
    // 7. 已付款订单禁止再次建立 Checkout
    // ========================================

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

    // ========================================
    // 8. 验证订单金额
    // ========================================

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

    const amount =
      Number(order.amount);

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "订单金额无效",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================
    // 9. 获取网站 URL
    // ========================================

    const siteUrl =
      process.env
        .NEXT_PUBLIC_SITE_URL;

    if (!siteUrl) {
      console.error(
        "NEXT_PUBLIC_SITE_URL is not configured"
      );

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

    // 防止 .env.local 中 URL 最后带 /
    const normalizedSiteUrl =
      siteUrl.replace(
        /\/+$/,
        ""
      );

    // ========================================
    // 10. 获取 Service Title
    // ========================================

    // Supabase 当前推断 services 为数组
    const service =
      order.services?.[0];

    const serviceTitle =
      service?.title ??
      "服务订单";

    // ========================================
    // 11. 创建 Mercado Pago Preference
    // ========================================

    const preference =
      new Preference(
        mercadoPagoClient
      );

    const result =
      await preference.create({
        body: {
          items: [
            {
              id:
                order.id,

              title:
                serviceTitle,

              quantity:
                1,

              unit_price:
                amount,

              currency_id:
                "MXN",
            },
          ],

          // Mercado Pago Payment
          // 完成后可以通过这个字段
          // 找回内部 Order ID
          external_reference:
            order.id,

          metadata: {
            order_id:
              order.id,

            user_id:
              user.id,
          },

          // ==================================
          // Payment Webhook
          // ==================================

          notification_url:
          `${normalizedSiteUrl}/api/webhooks/mercado-pago?source_news=webhooks`,


          // ==================================
          // Checkout 完成后的浏览器跳转
          // ==================================

          back_urls: {
            success:
              `${normalizedSiteUrl}/account/orders/${order.id}/payment/success`,

            failure:
              `${normalizedSiteUrl}/account/orders/${order.id}/payment/failure`,

            pending:
              `${normalizedSiteUrl}/account/orders/${order.id}/payment`,
          },

          auto_return:
            "approved",
        },
      });

    // ========================================
    // 12. 获取 Checkout URL
    // ========================================

    const checkoutUrl =
      result.sandbox_init_point ??
      result.init_point;

    if (!checkoutUrl) {
      console.error(
        "Mercado Pago Preference has no checkout URL:",
        {
          preferenceId:
            result.id,
        }
      );

      return NextResponse.json(
        {
          error:
            "Mercado Pago 未返回付款网址",
        },
        {
          status: 500,
        }
      );
    }

    console.log(
      "Mercado Pago Preference created:",
      {
        preferenceId:
          result.id,

        orderId:
          order.id,

        notificationUrl:
          `${normalizedSiteUrl}/api/webhooks/mercado-pago`,
      }
    );

    // ========================================
    // 13. 返回前端
    // ========================================

    return NextResponse.json({
      checkoutUrl,

      preferenceId:
        result.id,
    });
  } catch (error) {
    console.error(
      "Mercado Pago Checkout error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "建立 Mercado Pago 付款失败",
      },
      {
        status: 500,
      }
    );
  }
}