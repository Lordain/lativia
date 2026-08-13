import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import type {
  Fulfillment,
  FulfillmentActivity,
} from "@/types/fulfillment";

interface FulfillmentRow {
  id: string;

  order_id: string;
  service_id: string;

  status:
    Fulfillment["status"];

  fulfillment_type:
    Fulfillment["fulfillmentType"];

  current_step:
    string | null;

  human_review_required:
    boolean;

  human_review_reason:
    string | null;

  customer_action_required:
    boolean;

  customer_action_reason:
    string | null;

  failure_code:
    string | null;

  failure_reason:
    string | null;

  refund_review_required:
    boolean;

  started_at:
    string | null;

  completed_at:
    string | null;

  failed_at:
    string | null;

  created_at:
    string;

  updated_at:
    string;
}

interface FulfillmentActivityRow {
  id: string;

  fulfillment_id:
    string;

  order_id:
    string;

  actor_type:
    FulfillmentActivity["actorType"];

  actor_user_id:
    string | null;

  action:
    string;

  from_status:
    FulfillmentActivity["fromStatus"];

  to_status:
    FulfillmentActivity["toStatus"];

  message:
    string | null;

  metadata:
    Record<
      string,
      unknown
    > | null;

  created_at:
    string;
}

function mapFulfillment(
  row: FulfillmentRow
): Fulfillment {
  return {
    id:
      row.id,

    orderId:
      row.order_id,

    serviceId:
      row.service_id,

    status:
      row.status,

    fulfillmentType:
      row.fulfillment_type,

    currentStep:
      row.current_step,

    humanReviewRequired:
      row.human_review_required,

    humanReviewReason:
      row.human_review_reason,

    customerActionRequired:
      row.customer_action_required,

    customerActionReason:
      row.customer_action_reason,

    failureCode:
      row.failure_code,

    failureReason:
      row.failure_reason,

    refundReviewRequired:
      row.refund_review_required,

    startedAt:
      row.started_at,

    completedAt:
      row.completed_at,

    failedAt:
      row.failed_at,

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,
  };
}

function mapActivity(
  row: FulfillmentActivityRow
): FulfillmentActivity {
  return {
    id:
      row.id,

    fulfillmentId:
      row.fulfillment_id,

    orderId:
      row.order_id,

    actorType:
      row.actor_type,

    actorUserId:
      row.actor_user_id,

    action:
      row.action,

    fromStatus:
      row.from_status,

    toStatus:
      row.to_status,

    message:
      row.message,

    metadata:
      row.metadata ?? {},

    createdAt:
      row.created_at,
  };
}

export async function getAdminFulfillment(
  orderId: string
) {
  /*
   * 重要：
   * createAdminClient 使用 Service Role，
   * 会绕过 RLS。
   *
   * 所以这个函数本身必须先确认调用者
   * 真的是 Admin。
   */
  await requireAdmin();

  const supabase =
    createAdminClient();

  const {
    data:
      fulfillmentData,
    error:
      fulfillmentError,
  } =
    await supabase
      .from(
        "fulfillments"
      )
      .select(`
        id,
        order_id,
        service_id,
        status,
        fulfillment_type,
        current_step,
        human_review_required,
        human_review_reason,
        customer_action_required,
        customer_action_reason,
        failure_code,
        failure_reason,
        refund_review_required,
        started_at,
        completed_at,
        failed_at,
        created_at,
        updated_at
      `)
      .eq(
        "order_id",
        orderId
      )
      .maybeSingle();

  if (fulfillmentError) {
    console.error(
      "getAdminFulfillment error:",
      {
        message:
          fulfillmentError.message,

        details:
          fulfillmentError.details,

        hint:
          fulfillmentError.hint,

        code:
          fulfillmentError.code,
      }
    );

    throw new Error(
      "读取办理任务失败"
    );
  }

  if (!fulfillmentData) {
    return {
      fulfillment:
        null,

      activity:
        [] as FulfillmentActivity[],
    };
  }

  const {
    data:
      activityData,
    error:
      activityError,
  } =
    await supabase
      .from(
        "fulfillment_activity"
      )
      .select(`
        id,
        fulfillment_id,
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
        "fulfillment_id",
        fulfillmentData.id
      )
      .order(
        "created_at",
        {
          ascending:
            true,
        }
      );

  if (activityError) {
    console.error(
      "getAdminFulfillment activity error:",
      {
        message:
          activityError.message,

        details:
          activityError.details,

        hint:
          activityError.hint,

        code:
          activityError.code,
      }
    );

    throw new Error(
      "读取办理记录失败"
    );
  }

  return {
    fulfillment:
      mapFulfillment(
        fulfillmentData as
          FulfillmentRow
      ),

    activity:
      (
        activityData ??
        []
      ).map(
        (row) =>
          mapActivity(
            row as
              FulfillmentActivityRow
          )
      ),
  };
}