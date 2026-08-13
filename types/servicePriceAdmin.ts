import type {
  Currency,
  PaymentMethod,
  PaymentProvider,
} from "./payment";

export interface AdminServicePrice {
  id: string;

  serviceId: string;

  currency: Currency;

  amount: number;

  paymentMethod: PaymentMethod;

  paymentProvider: PaymentProvider;

  active: boolean;

  createdAt: string;
}

export interface ServicePriceFormData {
  currency: Currency;

  amount: string;

  paymentMethod: PaymentMethod;

  /**
   * 空字符串代表：
   * 尚未绑定正式 Provider。
   *
   * 例如：
   * WeChat Pay 已配置价格，
   * 但 Nuvei 尚未开通。
   */
  paymentProvider:
    | Exclude<
        PaymentProvider,
        null
      >
    | "";

  active: boolean;
}