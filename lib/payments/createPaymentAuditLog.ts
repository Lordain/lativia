import type {
    SupabaseClient,
  } from "@supabase/supabase-js";
  
  import type {
    PaymentAuditAction,
    PaymentAuditResult,
  } from "@/types/paymentAuditLog";
  
  interface Input {
    orderId?: string | null;
  
    adminUserId?: string | null;
  
    action: PaymentAuditAction;
  
    provider?: string | null;
  
    result: PaymentAuditResult;
  
    message?: string | null;
  
    metadata?: Record<
      string,
      unknown
    >;
  }
  
  export async function createPaymentAuditLog(
    supabaseAdmin: SupabaseClient,
    input: Input
  ) {
    const { error } =
      await supabaseAdmin
        .from("payment_audit_logs")
        .insert({
          order_id:
            input.orderId ?? null,
  
          admin_user_id:
            input.adminUserId ?? null,
  
          action:
            input.action,
  
          provider:
            input.provider ?? null,
  
          result:
            input.result,
  
          message:
            input.message ?? null,
  
          metadata:
            input.metadata ?? {},
        });
  
    if (error) {
      console.error(
        "Create payment audit log error:",
        error
      );
    }
  }