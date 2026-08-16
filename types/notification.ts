export type NotificationType =
  | "payment_confirmed"
  | "fulfillment_started"
  | "customer_action_required"
  | "customer_correction_approved"
  | "customer_correction_rejected"
  | "service_completed"
  | "service_failed"
  | "refund_review_started"
  | "refund_approved"
  | "refund_rejected"
  | "refund_processing"
  | "refund_succeeded";


export type NotificationStatus =
  | "unread"
  | "read";


export type NotificationChannel =
  | "in_app"
  | "email";


  export type NotificationDeliveryStatus =
  | "pending"
  | "processing"
  | "sent"
  | "failed"
  | "unknown";


export interface Notification {
  id: string;

  userId: string;

  orderId:
    string | null;

  fulfillmentId:
    string | null;

  refundId:
    string | null;

  type:
    NotificationType;

  title: string;

  message: string;

  status:
    NotificationStatus;

  readAt:
    string | null;

  idempotencyKey:
    string;

  metadata:
    Record<
      string,
      unknown
    >;

  createdAt: string;

  updatedAt: string;
}


export interface NotificationDelivery {
  id: string;

  notificationId: string;

  channel:
    NotificationChannel;

  provider:
    string | null;

  status:
    NotificationDeliveryStatus;

  recipient:
    string | null;

  providerMessageId:
    string | null;

  attemptCount:
    number;

  lastAttemptAt:
    string | null;

  sentAt:
    string | null;

  failedAt:
    string | null;

  failureReason:
    string | null;

  metadata:
    Record<
      string,
      unknown
    >;

  createdAt: string;

  updatedAt: string;
}


export interface CreateNotificationInput {
  userId: string;

  orderId?:
    string | null;

  fulfillmentId?:
    string | null;

  refundId?:
    string | null;

  type:
    NotificationType;

  title: string;

  message: string;

  idempotencyKey: string;

  metadata?:
    Record<
      string,
      unknown
    >;
}