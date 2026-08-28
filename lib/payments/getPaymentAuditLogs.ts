import { createClient } from "@/lib/supabase/server";

export async function getPaymentAuditLogs(
  orderId: string
) {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("payment_audit_logs")
      .select(`
        id,
        order_id,
        admin_user_id,
        action,
        provider,
        result,
        message,
        metadata,
        created_at
      `)
      .eq(
        "order_id",
        orderId
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (error) {
    console.error(
      "Get payment audit logs failed"
    );

    throw new Error(
      error.message
    );
  }

  return data ?? [];
}