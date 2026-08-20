import {
    createOrderNotification,
  } from "@/lib/notifications/createOrderNotification";
  
  import type {
    FulfillmentStatus,
  } from "@/types/fulfillment";
  
  
  interface NotifyFulfillmentTransitionInput {
    orderId: string;
  
    fulfillmentId: string;
  
    newStatus:
      FulfillmentStatus;
  
    reason?:
      string | null;
  }
  
  
  export async function notifyFulfillmentTransition(
    input:
      NotifyFulfillmentTransitionInput
  ) {
    const reason =
      input.reason?.trim() ??
      "";
  
  
    switch (
      input.newStatus
    ) {
      /*
       * validating / processing 都代表
       * 服务已经进入实际办理阶段。
       *
       * 使用同一个 idempotency key，
       * 客户只收到一次“开始办理”。
       */
  
      case "validating":
      case "processing":
        return createOrderNotification({
          orderId:
            input.orderId,
  
          fulfillmentId:
            input.fulfillmentId,
  
          type:
            "fulfillment_started",
  
          title:
            "服务已经开始办理",
  
          message:
            "您的订单已经进入办理流程。您可以随时在订单页面查看最新状态。",
  
          idempotencyKey:
            `fulfillment_started:${input.fulfillmentId}`,
  
          metadata: {
            fulfillmentStatus:
              input.newStatus,
          },
        });
  
  
      case "waiting_customer":
        return createOrderNotification({
          orderId:
            input.orderId,
  
          fulfillmentId:
            input.fulfillmentId,
  
          type:
            "customer_action_required",
  
          title:
            "需要您补充资料或完成操作",
  
          message:
            reason
              ? `您的订单目前需要您处理以下事项：${reason}`
              : "您的订单需要补充资料或完成相关操作。请进入订单页面查看详情。",
  
          /*
           * waiting_customer 可能发生多次。
           *
           * 如果以后要允许每一次客户处理要求产生新通知，
           * 会加入 transition/activity ID。
           *
           * MVP 目前每个 Fulfillment 保留一次。
           */
          idempotencyKey:
            `customer_action_required:${input.fulfillmentId}`,
  
          metadata: {
            reason:
              reason ||
              null,
          },
        });
  
  
        case "completed":
          return createOrderNotification({
            orderId:
              input.orderId,
        
            fulfillmentId:
              input.fulfillmentId,
        
            type:
              "service_completed",
        
            title:
              "服务已经完成",
        
            message:
              "您的服务已经完成。您可以进入订单页面查看最终服务状态；如本服务包含已交付结果，也可以在服务空间中查看。",
        
            idempotencyKey:
              `service_completed:${input.fulfillmentId}`,
          });
  
      case "failed":
        return createOrderNotification({
          orderId:
            input.orderId,
  
          fulfillmentId:
            input.fulfillmentId,
  
          type:
            "service_failed",
  
          title:
            "服务目前无法完成",
  
          message:
            reason
              ? `本次服务目前无法完成。原因：${reason}。我们将根据服务规则确认后续处理方式。`
              : "本次服务目前无法完成。我们将根据服务规则确认后续处理方式。",
  
          idempotencyKey:
            `service_failed:${input.fulfillmentId}`,
  
          metadata: {
            reason:
              reason ||
              null,
          },
        });
  
  
      case "refund_review":
        return createOrderNotification({
          orderId:
            input.orderId,
  
          fulfillmentId:
            input.fulfillmentId,
  
          type:
            "refund_review_started",
  
          title:
            "订单已进入退款资格审核",
  
          message:
            "由于本次服务无法完成，订单已经进入退款资格审核。审核通过后才会执行原路退款。",
  
          idempotencyKey:
            `refund_review_started:${input.fulfillmentId}`,
        });
  
  
      default:
        return null;
    }
  }