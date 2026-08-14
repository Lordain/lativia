import {
    stripe,
  } from "@/lib/payments/stripe";
  
  import type {
    RefundProvider,
    RefundProviderInput,
    RefundProviderResult,
  } from "@/lib/refunds/providers/types";
  
  export const stripeRefundProvider:
  RefundProvider = {
    async executeFullRefund(
      input:
        RefundProviderInput
    ): Promise<
      RefundProviderResult
    > {
      /*
       * provider_payment_id currently stores
       * Stripe PaymentIntent ID (pi_xxx).
       *
       * No amount is provided:
       * this intentionally creates a FULL refund.
       */
  
      const refund =
        await stripe.refunds.create(
          {
            payment_intent:
              input.providerPaymentId,
  
            metadata: {
              refundId:
                input.refundId,
  
              orderId:
                input.orderId,
            },
          },
          {
            idempotencyKey:
              input.idempotencyKey,
          }
        );
  
      const status =
        refund.status ??
        "unknown";
  
      return {
        providerRefundId:
          refund.id,
  
        providerStatus:
          status,
  
        finalState:
          status ===
          "succeeded"
            ? "succeeded"
            : "processing",
  
        metadata: {
          stripeRefundId:
            refund.id,
  
          stripeStatus:
            status,
  
          paymentIntent:
            typeof refund.payment_intent ===
            "string"
              ? refund.payment_intent
              : refund.payment_intent?.id ??
                null,
  
          amount:
            refund.amount,
  
          currency:
            refund.currency,
        },
      };
    },
  };