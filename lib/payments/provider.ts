import type {
    PaymentProvider,
  } from "@/types/payment";
  
  export function getPaymentRoute(
    provider: PaymentProvider
  ) {
    switch (provider) {
      case "stripe":
        return "/api/payments/stripe";
  
      case "mercado_pago":
        return "/api/payments/mercado-pago";
  
      case "wechat_pay":
        return "/api/payments/wechat-pay";
  
      default:
        throw new Error(
          "付款平台尚未設定"
        );
    }
  }