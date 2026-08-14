import {
  NextResponse,
} from "next/server";

import {
  WebhookSignatureValidator,
  InvalidWebhookSignatureError,
} from "mercadopago";

import {
  processMercadoPagoPayment,
} from "@/lib/payments/processMercadoPagoPayment";


export async function POST(
  request: Request
) {
  try {
    /*
     * ========================================
     * 1. Parse Webhook Body
     * ========================================
     */

    const body =
      await request.json();


    const url =
      new URL(
        request.url
      );


    /*
     * ========================================
     * 2. Mercado Pago Signature Inputs
     * ========================================
     */

    const xSignature =
      request.headers.get(
        "x-signature"
      );


    const xRequestId =
      request.headers.get(
        "x-request-id"
      );


    const signatureDataId =
      url.searchParams.get(
        "data.id"
      );


    const webhookSecret =
      process.env
        .MERCADO_PAGO_WEBHOOK_SECRET;


    /*
     * ========================================
     * 3. Configuration Validation
     * ========================================
     */

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
          status:
            500,
        }
      );
    }


    if (
      !xSignature ||
      !xRequestId ||
      !signatureDataId
    ) {
      console.error(
        "Mercado Pago webhook signature data missing",
        {
          hasSignature:
            Boolean(
              xSignature
            ),

          hasRequestId:
            Boolean(
              xRequestId
            ),

          dataId:
            signatureDataId,
        }
      );


      return NextResponse.json(
        {
          error:
            "Webhook signature 资料不完整",
        },
        {
          status:
            401,
        }
      );
    }


    /*
     * ========================================
     * 4. Official SDK Signature Verification
     * ========================================
     */

    try {
      WebhookSignatureValidator.validate({
        xSignature,

        xRequestId,

        dataId:
          signatureDataId,

        secret:
          webhookSecret,
      });

    } catch (
      error
    ) {
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
          }
        );


        return NextResponse.json(
          {
            error:
              "Webhook signature 验证失败",
          },
          {
            status:
              401,
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

        action:
          body?.action ??
          null,

        type:
          body?.type ??
          null,
      }
    );


    /*
     * ========================================
     * 5. Webhook Simulator
     * ========================================
     *
     * Mercado Pago Simulator 默认使用
     * Payment ID = 123456。
     *
     * Simulator 用于验证：
     *
     * - Public Webhook URL
     * - Secret Signature
     * - Signature validation
     *
     * 不继续调用真实 Payment API。
     */

    const bodyPaymentId =
      body?.data?.id !==
        null &&
      body?.data?.id !==
        undefined
        ? String(
            body.data.id
          )
        : null;


    if (
      bodyPaymentId ===
      "123456"
    ) {
      console.log(
        "Mercado Pago simulator webhook verified successfully"
      );


      return NextResponse.json({
        received:
          true,

        simulator:
          true,
      });
    }


    /*
     * ========================================
     * 6. Payment ID
     * ========================================
     */

    const paymentId =
      bodyPaymentId ??
      signatureDataId;


    if (!paymentId) {
      console.log(
        "Mercado Pago webhook ignored: payment ID missing"
      );


      return NextResponse.json({
        received:
          true,

        ignored:
          true,

        reason:
          "payment_id_missing",
      });
    }


    /*
     * ========================================
     * 7. Shared Mercado Pago Payment Engine
     * ========================================
     *
     * Webhook 不直接处理：
     *
     * - Payment API query
     * - status validation
     * - external_reference
     * - provider validation
     * - amount / currency
     * - idempotency
     * - confirm_payment_transaction()
     *
     * 全部统一交给：
     *
     * processMercadoPagoPayment()
     */

    const result =
      await processMercadoPagoPayment(
        paymentId
      );


    /*
     * ========================================
     * 8. Payment Not Approved
     * ========================================
     *
     * 包括：
     *
     * pending
     * rejected
     * cancelled
     * refunded
     *
     * Webhook 已被合法接收，
     * 但不属于新的付款成功事件。
     *
     * 返回 200，避免无意义重试。
     */

    if (
      result.status ===
      "not_approved"
    ) {
      console.log(
        "Mercado Pago payment ignored because it is not approved",
        {
          paymentId:
            result.paymentId,

          orderId:
            result.orderId,
        }
      );


      return NextResponse.json({
        received:
          true,

        approved:
          false,

        paymentId:
          result.paymentId,

        orderId:
          result.orderId,
      });
    }


    /*
     * ========================================
     * 9. Already Processed
     * ========================================
     */

    if (
      result.status ===
      "already_processed"
    ) {
      console.log(
        "Mercado Pago payment already processed",
        {
          paymentId:
            result.paymentId,

          orderId:
            result.orderId,
        }
      );


      return NextResponse.json({
        received:
          true,

        alreadyProcessed:
          true,

        paymentId:
          result.paymentId,

        orderId:
          result.orderId,
      });
    }


    /*
     * ========================================
     * 10. Confirmed
     * ========================================
     */

    console.log(
      "Mercado Pago payment confirmed through webhook",
      {
        paymentId:
          result.paymentId,

        orderId:
          result.orderId,
      }
    );


    return NextResponse.json({
      received:
        true,

      confirmed:
        true,

      paymentId:
        result.paymentId,

      orderId:
        result.orderId,
    });

  } catch (
    error
  ) {
    console.error(
      "Mercado Pago webhook error:",
      error
    );


    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Mercado Pago Webhook 处理失败",
      },
      {
        status:
          500,
      }
    );
  }
}