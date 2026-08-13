import type {
  PaymentMethod,
  PaymentProvider,
} from "@/types/payment";

export function getPaymentMethodLabel(
  paymentMethod: PaymentMethod
) {
  switch (paymentMethod) {
    case "local_payment":
      return "墨西哥本地付款";

    case "card":
      return "国际信用卡 / 借记卡";

    case "wechat_pay":
      return "微信支付";

    default:
      return paymentMethod;
  }
}

export function getPaymentProviderLabel(
  paymentProvider: PaymentProvider
) {
  switch (paymentProvider) {
    case "mercado_pago":
      return "Mercado Pago";

    case "stripe":
      return "Stripe";

    case "nuvei":
      return "Nuvei";

    case null:
      return "尚未配置";

    default:
      return paymentProvider;
  }
}