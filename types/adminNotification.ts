export interface AdminNotificationDeliveryItem {
    notificationId: string;
  
    notificationType: string;
  
    notificationTitle: string;
  
    orderId:
      string | null;
  
    userId: string;
  
    createdAt: string;
  
    channel: string;
  
    provider:
      string | null;
  
    deliveryStatus: string;
  
    recipient:
      string | null;
  
    providerMessageId:
      string | null;
  
    attemptCount: number;
  
    lastAttemptAt:
      string | null;
  
    sentAt:
      string | null;
  
    failedAt:
      string | null;
  
    failureReason:
      string | null;
  }