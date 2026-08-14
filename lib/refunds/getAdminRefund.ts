import {
    createAdminClient,
  } from "@/lib/supabase/admin";
  
  import {
    requireAdmin,
  } from "@/lib/auth/requireAdmin";
  
  import type {
    Refund,
    RefundActivity,
  } from "@/types/refund";
  
  interface RefundRow {
    id: string;
  
    order_id: string;
  
    fulfillment_id: string;
  
    payment_transaction_id:
      string | null;
  
    provider: string;
  
    provider_payment_id:
      string | null;
  
    provider_refund_id:
      string | null;
  
    amount: number | string;
  
    currency: string;
  
    status: string;
  
    reason: string;
  
    review_note:
      string | null;
  
    reviewed_by:
      string | null;
  
    reviewed_at:
      string | null;
  
    execution_started_at:
      string | null;
  
    refunded_at:
      string | null;
  
    failed_at:
      string | null;
  
    failure_reason:
      string | null;
  
    idempotency_key: string;
  
    created_at: string;
  
    updated_at: string;
  }
  
  interface RefundActivityRow {
    id: string;
  
    refund_id: string;
  
    order_id: string;
  
    actor_type: string;
  
    actor_user_id:
      string | null;
  
    action: string;
  
    from_status:
      string | null;
  
    to_status:
      string | null;
  
    message:
      string | null;
  
    metadata:
      Record<
        string,
        unknown
      > | null;
  
    created_at: string;
  }
  
  function mapRefund(
    row: RefundRow
  ): Refund {
    return {
      id:
        row.id,
  
      orderId:
        row.order_id,
  
      fulfillmentId:
        row.fulfillment_id,
  
      paymentTransactionId:
        row.payment_transaction_id,
  
      provider:
        row.provider as Refund["provider"],
  
      providerPaymentId:
        row.provider_payment_id,
  
      providerRefundId:
        row.provider_refund_id,
  
      amount:
        Number(
          row.amount
        ),
  
      currency:
        row.currency as Refund["currency"],
  
      status:
        row.status as Refund["status"],
  
      reason:
        row.reason,
  
      reviewNote:
        row.review_note,
  
      reviewedBy:
        row.reviewed_by,
  
      reviewedAt:
        row.reviewed_at,
  
      executionStartedAt:
        row.execution_started_at,
  
      refundedAt:
        row.refunded_at,
  
      failedAt:
        row.failed_at,
  
      failureReason:
        row.failure_reason,
  
      idempotencyKey:
        row.idempotency_key,
  
      createdAt:
        row.created_at,
  
      updatedAt:
        row.updated_at,
    };
  }
  
  function mapActivity(
    row:
      RefundActivityRow
  ): RefundActivity {
    return {
      id:
        row.id,
  
      refundId:
        row.refund_id,
  
      orderId:
        row.order_id,
  
      actorType:
        row.actor_type as
          RefundActivity["actorType"],
  
      actorUserId:
        row.actor_user_id,
  
      action:
        row.action,
  
      fromStatus:
        row.from_status as
          RefundActivity["fromStatus"],
  
      toStatus:
        row.to_status as
          RefundActivity["toStatus"],
  
      message:
        row.message,
  
      metadata:
        row.metadata ??
        {},
  
      createdAt:
        row.created_at,
    };
  }
  
  export async function getAdminRefund(
    orderId: string
  ) {
    await requireAdmin();
  
    const supabase =
      createAdminClient();
  
    const {
      data:
        refundData,
      error:
        refundError,
    } =
      await supabase
        .from(
          "refunds"
        )
        .select(`
          id,
          order_id,
          fulfillment_id,
          payment_transaction_id,
          provider,
          provider_payment_id,
          provider_refund_id,
          amount,
          currency,
          status,
          reason,
          review_note,
          reviewed_by,
          reviewed_at,
          execution_started_at,
          refunded_at,
          failed_at,
          failure_reason,
          idempotency_key,
          created_at,
          updated_at
        `)
        .eq(
          "order_id",
          orderId
        )
        .maybeSingle();
  
    if (
      refundError
    ) {
      console.error(
        "getAdminRefund refund error:",
        refundError
      );
  
      throw new Error(
        "读取退款资料失败"
      );
    }
  
    if (!refundData) {
      return {
        refund:
          null,
  
        activity:
          [] as RefundActivity[],
      };
    }
  
    const refund =
      mapRefund(
        refundData as RefundRow
      );
  
    const {
      data:
        activityData,
      error:
        activityError,
    } =
      await supabase
        .from(
          "refund_activity"
        )
        .select(`
          id,
          refund_id,
          order_id,
          actor_type,
          actor_user_id,
          action,
          from_status,
          to_status,
          message,
          metadata,
          created_at
        `)
        .eq(
          "refund_id",
          refund.id
        )
        .order(
          "created_at",
          {
            ascending:
              true,
          }
        );
  
    if (
      activityError
    ) {
      console.error(
        "getAdminRefund activity error:",
        activityError
      );
  
      throw new Error(
        "读取退款操作记录失败"
      );
    }
  
    return {
      refund,
  
      activity:
        (
          activityData ??
          []
        ).map(
          (
            row
          ) =>
            mapActivity(
              row as RefundActivityRow
            )
        ),
    };
  }