import type {
    Currency,
  } from "@/types/payment";
  
  export interface RefundProviderInput {
    refundId: string;
  
    orderId: string;
  
    providerPaymentId: string;
  
    amount: number;
  
    currency: Currency;
  
    idempotencyKey: string;
  }
  
  export interface RefundProviderResult {
    providerRefundId: string;
  
    providerStatus: string;
  
    finalState:
      | "succeeded"
      | "processing";
  
    metadata:
      Record<
        string,
        unknown
      >;
  }
  
  export interface RefundProvider {
    executeFullRefund(
      input:
        RefundProviderInput
    ): Promise<
      RefundProviderResult
    >;
  }