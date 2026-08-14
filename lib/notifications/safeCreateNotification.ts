import {
    createNotification,
  } from "@/lib/notifications/createNotification";
  
  import type {
    CreateNotificationInput,
    Notification,
  } from "@/types/notification";
  
  
  export async function safeCreateNotification(
    input:
      CreateNotificationInput
  ): Promise<
    Notification | null
  > {
    try {
      return await createNotification(
        input
      );
    } catch (error) {
      /*
       * ========================================
       * IMPORTANT
       * ========================================
       *
       * Notification failure MUST NOT break:
       *
       * - payment confirmation
       * - fulfillment transition
       * - refund approval
       * - refund execution
       *
       * 通知系统属于 secondary side effect。
       */
  
      console.error(
        "safeCreateNotification error:",
        {
          type:
            input.type,
  
          orderId:
            input.orderId ??
            null,
  
          fulfillmentId:
            input.fulfillmentId ??
            null,
  
          refundId:
            input.refundId ??
            null,
  
          idempotencyKey:
            input.idempotencyKey,
  
          error,
        }
      );
  
  
      return null;
    }
  }