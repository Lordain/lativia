import type {
  PaymentMethod,
  PaymentProvider,
} from "@/types/payment";

export function getPaymentMethodLabel(
  method: PaymentMethod
) {
  switch (method) {
    case "local_payment":
      return "墨西哥本地付款";

    case "card":
      return "国际信用卡 / 借记卡";

    case "wechat_pay":
      return "微信支付";
  }
}

export function getPaymentProviderLabel(
  provider: PaymentProvider
) {
  switch (provider) {
    case "mercado_pago":
      return "Mercado Pago";

    case "stripe":
      return "Stripe";

    case "wechat_pay":
      return "WeChat Pay";

    default:
      return "尚未指定";
  }
}