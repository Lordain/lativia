export type PaymentTransactionStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export interface PaymentTransaction {
  id: string;

  orderId: string;

  provider: string;

  providerEventId: string | null;
  providerSessionId: string | null;
  providerPaymentId: string | null;

  amount: number;
  currency: string;

  status: PaymentTransactionStatus;

  createdAt: string;
  updatedAt: string;
}