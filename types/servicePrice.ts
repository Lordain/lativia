import type {
  Currency,
  PaymentMethod,
  PaymentProvider,
} from "./payment";

export interface ServicePrice {
  id: string;

  serviceId: string;

  currency: Currency;

  amount: number;

  paymentMethod: PaymentMethod;

  paymentProvider: PaymentProvider;

  active: boolean;
}