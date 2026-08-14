"use server";

import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  sendNotificationEmail,
} from "@/lib/notifications/sendNotificationEmail";

import type {
  Notification,
} from "@/types/notification";


interface NotificationRow {
  id: string;

  user_id: string;

  order_id:
    string | null;

  fulfillment_id:
    string | null;

  refund_id:
    string | null;

  type: string;

  title: string;

  message: string;

  status: string;

  read_at:
    string | null;

  idempotency_key:
    string;

  metadata:
    Record<
      string,
      unknown
    > | null;

  created_at: string;

  updated_at: string;
}


function mapNotification(
  row:
    NotificationRow
): Notification {
  return {
    id:
      row.id,

    userId:
      row.user_id,

    orderId:
      row.order_id,

    fulfillmentId:
      row.fulfillment_id,

    refundId:
      row.refund_id,

    type:
      row.type as
        Notification["type"],

    title:
      row.title,

    message:
      row.message,

    status:
      row.status as
        Notification["status"],

    readAt:
      row.read_at,

    idempotencyKey:
      row.idempotency_key,

    metadata:
      row.metadata ??
      {},

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,
  };
}


export async function retryNotificationEmail(
  notificationId:
    string
) {
  await requireAdmin();


  const cleanId =
    notificationId.trim();


  if (!cleanId) {
    throw new Error(
      "NOTIFICATION_ID_REQUIRED"
    );
  }


  const admin =
    createAdminClient();


  /*
   * ========================================
   * 1. Read Email Delivery
   * ========================================
   */

  const {
    data:
      delivery,

    error:
      deliveryError,
  } =
    await admin
      .from(
        "notification_deliveries"
      )
      .select(`
        id,
        status,
        attempt_count
      `)
      .eq(
        "notification_id",
        cleanId
      )
      .eq(
        "channel",
        "email"
      )
      .maybeSingle();


  if (
    deliveryError
  ) {
    console.error(
      "retryNotificationEmail delivery lookup error:",
      deliveryError
    );


    throw new Error(
      "读取 Email Delivery 失败"
    );
  }


  if (!delivery) {
    throw new Error(
      "找不到 Email Delivery"
    );
  }


  if (
    delivery.status ===
    "sent"
  ) {
    return {
      success:
        true,

      alreadySent:
        true,
    };
  }


  if (
    delivery.status ===
    "processing"
  ) {
    throw new Error(
      "Email 正在处理中，请勿重复发送。"
    );
  }

  if (
    delivery.status ===
    "unknown"
  ) {
    throw new Error(
      "Email 的 Provider 结果尚未确认。为避免重复发送，请先根据 Provider Message ID 进行人工核对。"
    );
  }


  /*
   * ========================================
   * 2. Retry Limit
   * ========================================
   */

  if (
    delivery.attempt_count >=
    5
  ) {
    throw new Error(
      "Email 已达到最大重试次数，请人工检查。"
    );
  }


  /*
   * ========================================
   * 3. Read Notification
   * ========================================
   */

  const {
    data:
      notificationData,

    error:
      notificationError,
  } =
    await admin
      .from(
        "notifications"
      )
      .select(`
        id,
        user_id,
        order_id,
        fulfillment_id,
        refund_id,
        type,
        title,
        message,
        status,
        read_at,
        idempotency_key,
        metadata,
        created_at,
        updated_at
      `)
      .eq(
        "id",
        cleanId
      )
      .single();


  if (
    notificationError ||
    !notificationData
  ) {
    console.error(
      "retryNotificationEmail notification lookup error:",
      notificationError
    );


    throw new Error(
      "找不到 Notification"
    );
  }


  const notification =
    mapNotification(
      notificationData as
        NotificationRow
    );


  /*
   * ========================================
   * 4. Retry
   * ========================================
   */

  const result =
    await sendNotificationEmail(
      notification
    );


  if (!result) {
    throw new Error(
      "Email 重试失败，请检查 Delivery 状态。"
    );
  }


  return {
    success:
      true,

    result,
  };
}