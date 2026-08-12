import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  Payment,
  WebhookSignatureValidator,
  InvalidWebhookSignatureError,
} from "mercadopago";

import { mercadoPagoClient } from "@/lib/payments/mercadoPago";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const url =
      new URL(request.url);

    // ========================================
    // 1. Mercado Pago Webhook 签名验证
    // ========================================

    const xSignature =
      request.headers.get(
        "x-signature"
      );

    const xRequestId =
      request.headers.get(
        "x-request-id"
      );

    // Mercado Pago 官方验签使用 URL query 中的 data.id
    const signatureDataId =
    url.searchParams.get(
      "data.id"
    );

    const webhookSecret =
      process.env
        .MERCADO_PAGO_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error(
        "MERCADO_PAGO_WEBHOOK_SECRET is not configured"
      );

      return NextResponse.json(
        {
          error:
            "Webhook Secret 未配置",
        },
        {
          status: 500,
        }
      );
    }

    try {
        console.log(
            "Mercado Pago signature input:",
            {
              signatureDataId,
              requestId:
                xRequestId,
              hasSignature:
                Boolean(
                  xSignature
                ),
              requestUrl:
                request.url,
            }
          );


      WebhookSignatureValidator.validate({
        xSignature:
          xSignature ?? "",

        xRequestId:
          xRequestId ?? "",

        dataId:
          signatureDataId ?? "",

        secret:
          webhookSecret,
      });
    } catch (error) {
      if (
        error instanceof
        InvalidWebhookSignatureError
      ) {
        console.error(
          "Mercado Pago webhook signature verification failed",
          {
            dataId:
              signatureDataId,

            requestId:
              xRequestId,

            hasSignature:
              Boolean(
                xSignature
              ),
          }
        );

        return NextResponse.json(
          {
            error:
              "Webhook signature 验证失败",
          },
          {
            status: 401,
          }
        );
      }

      throw error;
    }

    console.log(
      "Mercado Pago webhook signature verified",
      {
        dataId:
          signatureDataId,

        requestId:
          xRequestId,
      }
    );

    console.log(
      "Mercado Pago webhook received:",
      body
    );

    // Mercado Pago Webhook Simulator
    // 默认示例 Payment ID 123456 并不是真实付款。
    // 验签成功后直接返回 200，避免继续调用 Payment API。
    if (
        body?.data?.id === "123456"
      ) {
        console.log(
          "Mercado Pago simulator webhook verified successfully"
        );
      
        return NextResponse.json({
          received: true,
          simulator: true,
        });
      }

    // ========================================
    // 2. 获取 Payment ID
    // ========================================

    const paymentId =
      body?.data?.id
        ? String(
            body.data.id
          )
        : null;

    if (!paymentId) {
      console.log(
        "Mercado Pago webhook has no payment ID"
      );

      return NextResponse.json({
        received: true,
      });
    }

    // ========================================
    // 3. 向 Mercado Pago 查询真实 Payment
    // ========================================

    const paymentClient =
      new Payment(
        mercadoPagoClient
      );

    const payment =
      await paymentClient.get({
        id: paymentId,
      });

    console.log(
      "Mercado Pago payment retrieved:",
      {
        id:
          payment.id,

        status:
          payment.status,

        externalReference:
          payment.external_reference,

        amount:
          payment.transaction_amount,

        currency:
          payment.currency_id,
      }
    );

    // ========================================
    // 4. 只处理 approved
    // ========================================

    if (
      payment.status !==
      "approved"
    ) {
      console.log(
        `Mercado Pago payment ${payment.id} is not approved:`,
        payment.status
      );

      return NextResponse.json({
        received: true,
        approved: false,
      });
    }

    // ========================================
    // 5. 获取内部 Order ID
    // ========================================

    const orderId =
      payment.external_reference;

    if (!orderId) {
      console.error(
        "Mercado Pago payment missing external_reference:",
        payment.id
      );

      return NextResponse.json(
        {
          error:
            "Mercado Pago Payment 缺少 external_reference",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================
    // 6. Payment 数据完整性检查
    // ========================================

    if (
      payment.transaction_amount ===
        null ||
      payment.transaction_amount ===
        undefined ||
      !payment.currency_id
    ) {
      console.error(
        "Mercado Pago payment data incomplete:",
        {
          paymentId:
            payment.id,

          amount:
            payment.transaction_amount,

          currency:
            payment.currency_id,
        }
      );

      return NextResponse.json(
        {
          error:
            "Mercado Pago Payment 资料不完整",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================
    // 7. Supabase Admin Client
    // ========================================

    const supabaseAdmin =
      createClient(
        process.env
          .NEXT_PUBLIC_SUPABASE_URL!,

        process.env
          .SUPABASE_SECRET_KEY!
      );

    // ========================================
    // 8. 查询订单
    // ========================================

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
        "Mercado Pago webhook: order not found",
        {
          orderId,
          error:
            orderError,
        }
      );

      return NextResponse.json(
        {
          error:
            "找不到订单",
        },
        {
          status: 404,
        }
      );
    }

    // ========================================
    // 9. Provider / Method 验证
    // ========================================

    if (
      order.payment_provider !==
        "mercado_pago" ||
      order.payment_method !==
        "local_payment"
    ) {
      console.error(
        "Mercado Pago provider mismatch:",
        {
          orderId:
            order.id,

          paymentProvider:
            order.payment_provider,

          paymentMethod:
            order.payment_method,
        }
      );

      return NextResponse.json(
        {
          error:
            "订单付款方式不匹配",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================
    // 10. 金额验证
    // ========================================

    if (
      Number(
        payment.transaction_amount
      ) !==
      Number(order.amount)
    ) {
      console.error(
        "Mercado Pago amount mismatch:",
        {
          orderId:
            order.id,

          mercadoPagoAmount:
            payment.transaction_amount,

          orderAmount:
            order.amount,
        }
      );

      return NextResponse.json(
        {
          error:
            "付款金额不匹配",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================
    // 11. 币种验证
    // ========================================

    if (
      payment.currency_id !==
      order.currency
    ) {
      console.error(
        "Mercado Pago currency mismatch:",
        {
          orderId:
            order.id,

          mercadoPagoCurrency:
            payment.currency_id,

          orderCurrency:
            order.currency,
        }
      );

      return NextResponse.json(
        {
          error:
            "付款币种不匹配",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================
    // 12. 幂等检查
    // ========================================

    const {
      data:
        existingTransaction,
      error:
        existingTransactionError,
    } = await supabaseAdmin
      .from(
        "payment_transactions"
      )
      .select("id")
      .eq(
        "provider",
        "mercado_pago"
      )
      .eq(
        "provider_payment_id",
        String(payment.id)
      )
      .maybeSingle();

    if (
      existingTransactionError
    ) {
      console.error(
        "Check Mercado Pago existing transaction error:",
        existingTransactionError
      );

      return NextResponse.json(
        {
          error:
            "检查支付交易记录失败",
        },
        {
          status: 500,
        }
      );
    }

    if (
      existingTransaction
    ) {
      console.log(
        `Mercado Pago payment ${payment.id} already processed`
      );

      return NextResponse.json({
        received: true,

        alreadyProcessed:
          true,

        paymentId:
          payment.id,

        orderId:
          order.id,
      });
    }

    // ========================================
    // 13. 调用原子确认付款 RPC
    // ========================================

    const {
      error:
        confirmPaymentError,
    } = await supabaseAdmin.rpc(
      "confirm_payment_transaction",
      {
        p_order_id:
          order.id,

        p_provider:
          "mercado_pago",

        p_provider_event_id:
          `payment:${payment.id}`,

        p_provider_session_id:
          null,

        p_provider_payment_id:
          String(
            payment.id
          ),

        p_amount:
          Number(
            payment.transaction_amount
          ),

        p_currency:
          payment.currency_id,
      }
    );

    if (
      confirmPaymentError
    ) {
      console.error(
        "Mercado Pago confirm payment error:",
        confirmPaymentError
      );

      return NextResponse.json(
        {
          error:
            "确认 Mercado Pago 付款失败",
        },
        {
          status: 500,
        }
      );
    }

    console.log(
      `Mercado Pago payment ${payment.id} confirmed for order ${order.id}`
    );

    // ========================================
    // 14. 成功返回
    // ========================================

    return NextResponse.json({
      received: true,

      confirmed: true,

      orderId:
        order.id,

      paymentId:
        payment.id,
    });
  } catch (error) {
    console.error(
      "Mercado Pago webhook error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Mercado Pago Webhook 处理失败",
      },
      {
        status: 500,
      }
    );
  }
}