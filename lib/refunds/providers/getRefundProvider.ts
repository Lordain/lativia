import type {
    PaymentProvider,
  } from "@/types/payment";
  
  import type {
    RefundProvider,
  } from "@/lib/refunds/providers/types";
  
  import {
    stripeRefundProvider,
  } from "@/lib/refunds/providers/stripeRefundProvider";
  
  import {
    mercadoPagoRefundProvider,
  } from "@/lib/refunds/providers/mercadoPagoRefundProvider";
  
  export function getRefundProvider(
    provider:
      PaymentProvider
  ): RefundProvider {
    switch (
      provider
    ) {
      case "stripe":
        return stripeRefundProvider;
  
      case "mercado_pago":
        return mercadoPagoRefundProvider;
  
      case "nuvei":
        throw new Error(
          "NUVEI_REFUND_NOT_IMPLEMENTED"
        );
  
      case null:
        throw new Error(
          "REFUND_PROVIDER_NOT_CONFIGURED"
        );
  
      default:
        throw new Error(
          "UNSUPPORTED_REFUND_PROVIDER"
        );
    }
  }