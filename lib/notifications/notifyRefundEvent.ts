import {
    createOrderNotification,
  } from "@/lib/notifications/createOrderNotification";
  
  
  export type RefundNotificationEvent =
    | "approved"
    | "rejected"
    | "processing"
    | "succeeded";
  
  
  interface NotifyRefundEventInput {
    refundId: string;
  
    orderId: string;
  
    fulfillmentId:
      string | null;
  
    event:
      RefundNotificationEvent;
  
    amount?:
      number | null;
  
    currency?:
      string | null;
  
    reason?:
      string | null;
  }
  
  
  export async function notifyRefundEvent(
    input:
      NotifyRefundEventInput
  ) {
    switch (
      input.event
    ) {
      case "approved":
        return createOrderNotification({
          orderId:
            input.orderId,
  
          fulfillmentId:
            input.fulfillmentId,
  
          refundId:
            input.refundId,
  
          type:
            "refund_approved",
  
          title:
            "退款审核已经通过",
  
          message:
            "您的退款资格审核已经通过。系统将按照原付款渠道执行退款。",
  
          idempotencyKey:
            `refund_approved:${input.refundId}`,
        });
  
  
      case "rejected":
        return createOrderNotification({
          orderId:
            input.orderId,
  
          fulfillmentId:
            input.fulfillmentId,
  
          refundId:
            input.refundId,
  
          type:
            "refund_rejected",
  
          title:
            "退款审核结果已更新",
  
          message:
            input.reason
              ? `本次退款申请未通过审核。原因：${input.reason}`
              : "本次退款申请未通过审核。您可以查看订单详情了解相关处理结果。",
  
          idempotencyKey:
            `refund_rejected:${input.refundId}`,
  
          metadata: {
            reason:
              input.reason ??
              null,
          },
        });
  
  
      case "processing":
        return createOrderNotification({
          orderId:
            input.orderId,
  
          fulfillmentId:
            input.fulfillmentId,
  
          refundId:
            input.refundId,
  
          type:
            "refund_processing",
  
          title:
            "退款正在处理中",
  
          message:
            "退款已经提交至原支付渠道，目前正在处理中。请勿重复申请退款。",
  
          idempotencyKey:
            `refund_processing:${input.refundId}`,
        });
  
  
      case "succeeded": {
        const amountText =
          input.amount !==
            null &&
          input.amount !==
            undefined &&
          input.currency
            ? `${input.currency} ${input.amount.toFixed(
                2
              )}`
            : null;
  
  
        return createOrderNotification({
          orderId:
            input.orderId,
  
          fulfillmentId:
            input.fulfillmentId,
  
          refundId:
            input.refundId,
  
          type:
            "refund_succeeded",
  
          title:
            "退款已经完成",
  
          message:
            amountText
              ? `您的订单已经完成原路退款，退款金额为 ${amountText}。实际到账时间取决于原支付渠道及金融机构的处理时间。`
              : "您的订单已经完成原路退款。实际到账时间取决于原支付渠道及金融机构的处理时间。",
  
          idempotencyKey:
            `refund_succeeded:${input.refundId}`,
  
          metadata: {
            amount:
              input.amount ??
              null,
  
            currency:
              input.currency ??
              null,
          },
        });
      }
    }
  }