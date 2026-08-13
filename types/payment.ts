export type PaymentStatus =
  | "unpaid"
  | "paid"
  | "failed"
  | "refunded";

export type Currency =
  | "MXN"
  | "CNY";

export type PaymentMethod =
  | "local_payment"
  | "card"
  | "wechat_pay";

/**
 * PaymentProvider 表示真正处理付款的 PSP。
 *
 * payment_method = wechat_pay
 * 不代表 provider 也是 wechat_pay。
 *
 * 未来例如：
 * payment_method = wechat_pay
 * payment_provider = nuvei
 */
export type PaymentProvider =
  | "mercado_pago"
  | "stripe"
  | "nuvei"
  | null;