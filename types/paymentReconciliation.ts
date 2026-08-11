export type ReconciliationIssueType =
  | "missing_transaction"
  | "payment_status_mismatch"
  | "amount_mismatch"
  | "currency_mismatch";

export interface PaymentReconciliationIssue {
  orderId: string;

  type: ReconciliationIssueType;

  message: string;

  orderPaymentStatus: string;

  transactionId?: string;

  transactionStatus?: string;
}