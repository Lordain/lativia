import {
    createClient,
  } from "@/lib/supabase/server";
  
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
  
  
  export async function getMyNotifications(
    limit:
      number = 50
  ): Promise<
    Notification[]
  > {
    const supabase =
      await createClient();
  
  
    const {
      data: {
        user,
      },
  
      error:
        userError,
    } =
      await supabase.auth.getUser();
  
  
    if (
      userError ||
      !user
    ) {
      return [];
    }
  
  
    const safeLimit =
      Math.min(
        Math.max(
          limit,
          1
        ),
        100
      );
  
  
    const {
      data,
      error,
    } =
      await supabase
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
          "user_id",
          user.id
        )
        .order(
          "created_at",
          {
            ascending:
              false,
          }
        )
        .limit(
          safeLimit
        );
  
  
    if (error) {
      console.error(
        "getMyNotifications error:",
        error
      );
  
  
      throw new Error(
        "读取通知失败"
      );
    }
  
  
    return (
      data ??
      []
    ).map(
      (
        row
      ) =>
        mapNotification(
          row as
            NotificationRow
        )
    );
  }