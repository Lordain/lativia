import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  sendNotificationEmail,
} from "@/lib/notifications/sendNotificationEmail";

import type {
  CreateNotificationInput,
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


export async function createNotification(
  input:
    CreateNotificationInput
): Promise<
  Notification
> {
  const admin =
    createAdminClient();


  /*
   * ========================================
   * 1. Input Validation
   * ========================================
   */

  const title =
    input.title.trim();

  const message =
    input.message.trim();

  const idempotencyKey =
    input.idempotencyKey.trim();


  if (!input.userId) {
    throw new Error(
      "NOTIFICATION_USER_ID_REQUIRED"
    );
  }


  if (!title) {
    throw new Error(
      "NOTIFICATION_TITLE_REQUIRED"
    );
  }


  if (!message) {
    throw new Error(
      "NOTIFICATION_MESSAGE_REQUIRED"
    );
  }


  if (!idempotencyKey) {
    throw new Error(
      "NOTIFICATION_IDEMPOTENCY_KEY_REQUIRED"
    );
  }


  /*
   * ========================================
   * 2. Create Notification
   * ========================================
   */

  const {
    data:
      insertedNotification,

    error:
      insertError,
  } =
    await admin
      .from(
        "notifications"
      )
      .insert({
        user_id:
          input.userId,

        order_id:
          input.orderId ??
          null,

        fulfillment_id:
          input.fulfillmentId ??
          null,

        refund_id:
          input.refundId ??
          null,

        type:
          input.type,

        title,

        message,

        status:
          "unread",

        read_at:
          null,

        idempotency_key:
          idempotencyKey,

        metadata:
          input.metadata ??
          {},
      })
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
      .maybeSingle();


  let notificationRow:
    NotificationRow | null =
    insertedNotification as
      NotificationRow | null;


  /*
   * ========================================
   * 3. Duplicate = Idempotent Success
   * ========================================
   */

  if (
    insertError
  ) {
    if (
      insertError.code !==
      "23505"
    ) {
      console.error(
        "createNotification insert error:",
        insertError
      );


      throw new Error(
        insertError.message
      );
    }


    const {
      data:
        existingNotification,

      error:
        existingError,
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
          "idempotency_key",
          idempotencyKey
        )
        .single();


    if (
      existingError ||
      !existingNotification
    ) {
      console.error(
        "createNotification idempotency lookup error:",
        existingError
      );


      throw new Error(
        "NOTIFICATION_IDEMPOTENCY_LOOKUP_FAILED"
      );
    }


    notificationRow =
      existingNotification as
        NotificationRow;
  }


  if (!notificationRow) {
    throw new Error(
      "NOTIFICATION_CREATE_FAILED"
    );
  }


  const notification =
    mapNotification(
      notificationRow
    );


  /*
   * ========================================
   * 4. In-App Delivery
   * ========================================
   */

  const now =
    new Date()
      .toISOString();


  const {
    error:
      deliveryError,
  } =
    await admin
      .from(
        "notification_deliveries"
      )
      .upsert(
        {
          notification_id:
            notification.id,

          channel:
            "in_app",

          provider:
            "internal",

          status:
            "sent",

          recipient:
            null,

          provider_message_id:
            null,

          attempt_count:
            1,

          last_attempt_at:
            now,

          sent_at:
            now,

          failed_at:
            null,

          failure_reason:
            null,

          metadata: {
            source:
              "notification_engine",
          },
        },
        {
          onConflict:
            "notification_id,channel",

          ignoreDuplicates:
            true,
        }
      );


  if (
    deliveryError
  ) {
    console.error(
      "createNotification in-app delivery error:",
      deliveryError
    );
  }


  /*
   * ========================================
   * 5. Email Delivery
   * ========================================
   *
   * Important:
   *
   * Email 是 secondary side effect。
   *
   * 发送失败只记录 delivery failed，
   * 绝不能让 Notification / Payment /
   * Fulfillment / Refund 主流程失败。
   */

  try {
    await sendNotificationEmail(
      notification
    );

  } catch (
    error
  ) {
    console.error(
      "createNotification email delivery error:",
      {
        notificationId:
          notification.id,

        type:
          notification.type,

        error,
      }
    );
  }


  return notification;
}