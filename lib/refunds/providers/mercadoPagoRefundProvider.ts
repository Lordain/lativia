import type {
    RefundProvider,
    RefundProviderInput,
    RefundProviderResult,
  } from "@/lib/refunds/providers/types";
  
  interface MercadoPagoRefundResponse {
    id?: number | string;
  
    payment_id?:
      number | string;
  
    amount?:
      number;
  
    status?:
      string;
  
    date_created?:
      string;
  }
  
  export const mercadoPagoRefundProvider:
  RefundProvider = {
    async executeFullRefund(
      input:
        RefundProviderInput
    ): Promise<
      RefundProviderResult
    > {
      const accessToken =
        process.env
          .MERCADO_PAGO_ACCESS_TOKEN;
  
      if (!accessToken) {
        throw new Error(
          "MERCADO_PAGO_ACCESS_TOKEN_NOT_CONFIGURED"
        );
      }
  
      /*
       * FULL REFUND:
       *
       * No amount body is sent.
       */
  
      const response =
        await fetch(
          `https://api.mercadopago.com/v1/payments/${encodeURIComponent(
            input.providerPaymentId
          )}/refunds`,
          {
            method:
              "POST",
  
            headers: {
              Authorization:
                `Bearer ${accessToken}`,
  
              "X-Idempotency-Key":
                input.idempotencyKey,
  
              Accept:
                "application/json",
            },
  
            cache:
              "no-store",
          }
        );
  
      const rawText =
        await response.text();
  
      let data:
        MercadoPagoRefundResponse &
        Record<
          string,
          unknown
        > =
        {};
  
      if (
        rawText
      ) {
        try {
          data =
            JSON.parse(
              rawText
            );
        } catch {
          data = {
            rawResponse:
              rawText,
          };
        }
      }
  
      if (
        !response.ok
      ) {
        const message =
          typeof data.message ===
          "string"
            ? data.message
            : typeof data.error ===
              "string"
            ? data.error
            : `Mercado Pago refund failed with HTTP ${response.status}`;
  
        throw new Error(
          `MERCADO_PAGO_REFUND_ERROR: ${message}`
        );
      }
  
      const providerRefundId =
        data.id !==
        undefined
          ? String(
              data.id
            )
          : "";
  
      if (
        !providerRefundId
      ) {
        throw new Error(
          "MERCADO_PAGO_REFUND_ID_MISSING"
        );
      }
  
      const providerStatus =
        typeof data.status ===
        "string"
          ? data.status
          : "approved";
  
      /*
       * Mercado Pago refund API has accepted
       * and returned the refund resource.
       *
       * Treat explicitly approved/succeeded
       * responses as final.
       *
       * Unknown future statuses remain
       * processing until reconciliation.
       */
  
      const finalState =
        providerStatus ===
          "approved" ||
        providerStatus ===
          "succeeded"
          ? "succeeded"
          : "processing";
  
      return {
        providerRefundId,
  
        providerStatus,
  
        finalState,
  
        metadata: {
          mercadoPagoRefundId:
            providerRefundId,
  
          mercadoPagoStatus:
            providerStatus,
  
          mercadoPagoPaymentId:
            data.payment_id ??
            input.providerPaymentId,
  
          amount:
            data.amount ??
            input.amount,
  
          dateCreated:
            data.date_created ??
            null,
  
          httpStatus:
            response.status,
        },
      };
    },
  };