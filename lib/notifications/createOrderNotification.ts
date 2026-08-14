import {
    createAdminClient,
  } from "@/lib/supabase/admin";
  
  import {
    safeCreateNotification,
  } from "@/lib/notifications/safeCreateNotification";
  
  import type {
    NotificationType,
  } from "@/types/notification";
  
  
  interface CreateOrderNotificationInput {
    orderId: string;
  
    fulfillmentId?:
      string | null;
  
    refundId?:
      string | null;
  
    type:
      NotificationType;
  
    title: string;
  
    message: string;
  
    idempotencyKey:
      string;
  
    metadata?:
      Record<
        string,
        unknown
      >;
  }
  
  
  export async function createOrderNotification(
    input:
      CreateOrderNotificationInput
  ) {
    const admin =
      createAdminClient();
  
  
    /*
     * ========================================
     * Resolve Customer
     * ========================================
     */
  
    const {
      data:
        order,
  
      error:
        orderError,
    } =
      await admin
        .from(
          "orders"
        )
        .select(`
          id,
          user_id
        `)
        .eq(
          "id",
          input.orderId
        )
        .single();
  
  
    if (
      orderError ||
      !order
    ) {
      console.error(
        "createOrderNotification order lookup error:",
        {
          orderId:
            input.orderId,
  
          error:
            orderError,
        }
      );
  
  
      return null;
    }
  
  
    /*
     * 某些历史 / 管理员建立的订单
     * user_id 可能为空。
     *
     * 没有 Customer 就不建立客户通知。
     */
  
    if (
      !order.user_id
    ) {
      console.warn(
        "createOrderNotification skipped: order has no user",
        {
          orderId:
            input.orderId,
  
          type:
            input.type,
        }
      );
  
  
      return null;
    }
  
  
    return safeCreateNotification({
      userId:
        order.user_id,
  
      orderId:
        input.orderId,
  
      fulfillmentId:
        input.fulfillmentId ??
        null,
  
      refundId:
        input.refundId ??
        null,
  
      type:
        input.type,
  
      title:
        input.title,
  
      message:
        input.message,
  
      idempotencyKey:
        input.idempotencyKey,
  
      metadata:
        input.metadata ??
        {},
    });
  }