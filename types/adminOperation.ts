export type AdminOperationType =
  | "waiting_human"
  | "waiting_customer"
  | "manual_review"
  | "refund_review"
  | "failed_pending_review"
  | "missing_fulfillment"
  | "paid_without_transaction"
  | "transaction_paid_order_unpaid";

export type AdminOperationPriority =
  | "critical"
  | "high"
  | "medium"
  | "low";

export interface AdminOperationItem {
  type: AdminOperationType;

  priority: AdminOperationPriority;

  orderId: string;

  fulfillmentId: string | null;

  serviceId: string;

  serviceTitle: string;

  customerName: string | null;

  customerPhone: string | null;

  fulfillmentStatus: string | null;

  currentStep: string | null;

  reason: string | null;

  humanReviewRequired: boolean;

  customerActionRequired: boolean;

  refundReviewRequired: boolean;

  createdAt: string;

  updatedAt: string;

  ageHours: number;
}

export interface AdminOperationsQueue {
  items: AdminOperationItem[];

  counts: {
    total: number;

    waitingHuman: number;

    waitingCustomer: number;

    manualReview: number;

    refundReview: number;

    failedPendingReview: number;

    missingFulfillment: number;

    paidWithoutTransaction: number;

    transactionPaidOrderUnpaid: number;

    overdue24h: number;
  };
}