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

    case "nuvei":
      return "/api/payments/nuvei";

    case null:
      return null;

    default:
      return null;
  }
}