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

export type PaymentProvider =
  | "mercado_pago"
  | "stripe"
  | "wechat_pay"
  | null;