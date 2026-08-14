import {
    requireAdmin,
  } from "@/lib/auth/requireAdmin";
  
  import {
    createAdminClient,
  } from "@/lib/supabase/admin";
  
  import type {
    AdminNotificationDeliveryItem,
  } from "@/types/adminNotification";
  
  
  export async function getAdminNotificationDeliveries():
  Promise<
    AdminNotificationDeliveryItem[]
  > {
    await requireAdmin();
  
  
    const admin =
      createAdminClient();
  
  
    const {
      data,
      error,
    } =
      await admin
        .from(
          "notification_deliveries"
        )
        .select(`
          id,
          channel,
          provider,
          status,
          recipient,
          provider_message_id,
          attempt_count,
          last_attempt_at,
          sent_at,
          failed_at,
          failure_reason,
          created_at,
  
          notifications (
            id,
            user_id,
            order_id,
            type,
            title,
            created_at
          )
        `)
        .order(
          "created_at",
          {
            ascending:
              false,
          }
        )
        .limit(
          200
        );
  
  
    if (error) {
      console.error(
        "getAdminNotificationDeliveries error:",
        error
      );
  
      throw new Error(
        "读取 Notification Delivery 失败"
      );
    }
  
  
    return (
      data ??
      []
    ).flatMap(
      row => {
        const notification =
          Array.isArray(
            row.notifications
          )
            ? row.notifications[0]
            : row.notifications;
  
  
        if (!notification) {
          return [];
        }
  
  
        return [
          {
            notificationId:
              notification.id,
  
            notificationType:
              notification.type,
  
            notificationTitle:
              notification.title,
  
            orderId:
              notification.order_id,
  
            userId:
              notification.user_id,
  
            createdAt:
              notification.created_at,
  
            channel:
              row.channel,
  
            provider:
              row.provider,
  
            deliveryStatus:
              row.status,
  
            recipient:
              row.recipient,
  
            providerMessageId:
              row.provider_message_id,
  
            attemptCount:
              row.attempt_count,
  
            lastAttemptAt:
              row.last_attempt_at,
  
            sentAt:
              row.sent_at,
  
            failedAt:
              row.failed_at,
  
            failureReason:
              row.failure_reason,
          },
        ];
      }
    );
  }