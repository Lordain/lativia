import type {
    FulfillmentType,
  } from "@/types/service";
  
  export type FulfillmentStatus =
    | "queued"
    | "validating"
    | "processing"
    | "waiting_human"
    | "waiting_customer"
    | "manual_review"
    | "completed"
    | "failed"
    | "refund_review";
  
  export type FulfillmentActorType =
    | "system"
    | "admin"
    | "customer";
  
  export interface Fulfillment {
    id: string;
  
    orderId: string;
    serviceId: string;
  
    status:
      FulfillmentStatus;
  
    fulfillmentType:
      FulfillmentType;
  
    currentStep:
      string | null;
  
    humanReviewRequired:
      boolean;
  
    humanReviewReason:
      string | null;
  
    customerActionRequired:
      boolean;
  
    customerActionReason:
      string | null;
  
    failureCode:
      string | null;
  
    failureReason:
      string | null;
  
    refundReviewRequired:
      boolean;
  
    startedAt:
      string | null;
  
    completedAt:
      string | null;
  
    failedAt:
      string | null;
  
    createdAt:
      string;
  
    updatedAt:
      string;
  }
  
  export interface FulfillmentActivity {
    id: string;
  
    fulfillmentId:
      string;
  
    orderId:
      string;
  
    actorType:
      FulfillmentActorType;
  
    actorUserId:
      string | null;
  
    action:
      string;
  
    fromStatus:
      FulfillmentStatus | null;
  
    toStatus:
      FulfillmentStatus | null;
  
    message:
      string | null;
  
    metadata:
      Record<
        string,
        unknown
      >;
  
    createdAt:
      string;
  }