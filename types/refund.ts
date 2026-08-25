import type {
    Currency,
    PaymentProvider,
  } from "@/types/payment";
  
  export type RefundStatus =
    | "pending_review"
    | "approved"
    | "rejected"
    | "processing"
    | "succeeded"
    | "failed";
  
  export type RefundActorType =
    | "system"
    | "admin";
  
  export interface Refund {
    id: string;
  
    orderId: string;
  
    fulfillmentId: string;
  
    paymentTransactionId:
      string | null;
  
    provider:
      PaymentProvider;
  
    providerPaymentId:
      string | null;
  
    providerRefundId:
      string | null;
  
    amount: number;
  
    currency: Currency;
  
    status: RefundStatus;
  
    reason: string;
  
    reviewNote:
      string | null;
  
    reviewedBy:
      string | null;
  
    reviewedAt:
      string | null;
  
    executionStartedAt:
      string | null;
  
    refundedAt:
      string | null;
  
    failedAt:
      string | null;
  
    failureReason:
      string | null;
  
    idempotencyKey:
      string;
  
    createdAt: string;
  
    updatedAt: string;
  }
  
  export interface RefundActivity {
    id: string;
  
    refundId: string;
  
    orderId: string;
  
    actorType:
      RefundActorType;
  
    actorUserId:
      string | null;
  
    action: string;
  
    fromStatus:
      RefundStatus | null;
  
    toStatus:
      RefundStatus | null;
  
    message:
      string | null;
  
    metadata:
      Record<
        string,
        unknown
      >;
  
    createdAt: string;
  }