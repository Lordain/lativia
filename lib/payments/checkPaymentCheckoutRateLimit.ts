import {
    createAdminClient,
  } from "@/lib/supabase/admin";
  
  import type {
    PaymentProvider,
  } from "@/types/payment";
  
  
  interface Input {
    userId: string;
    orderId: string;
  
    provider:
      PaymentProvider;
  }
  
  
  export interface PaymentCheckoutRateLimitResult {
    allowed: boolean;
  
    retryAfterSeconds:
      number | null;
  }
  
  
  export async function checkPaymentCheckoutRateLimit(
    input: Input
  ): Promise<
    PaymentCheckoutRateLimitResult
  > {
    const admin =
      createAdminClient();
  
  
    const {
      data,
      error,
    } =
      await admin.rpc(
        "consume_payment_checkout_attempt",
        {
          p_user_id:
            input.userId,
  
          p_order_id:
            input.orderId,
  
          p_provider:
            input.provider,
        }
      );
  
  
    if (error) {
      console.error(
        "Payment checkout rate limit check failed"
      );
  
      throw new Error(
        "PAYMENT_RATE_LIMIT_FAILED"
      );
    }
  
  
    if (
      typeof data !==
      "number"
    ) {
      throw new Error(
        "PAYMENT_RATE_LIMIT_INVALID_RESULT"
      );
    }
  
  
    if (data > 0) {
      return {
        allowed:
          false,
  
        retryAfterSeconds:
          data,
      };
    }
  
  
    return {
      allowed:
        true,
  
      retryAfterSeconds:
        null,
    };
  }