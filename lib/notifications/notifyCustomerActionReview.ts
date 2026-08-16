import {
    createOrderNotification,
  } from "@/lib/notifications/createOrderNotification";
  
  
  interface NotifyCustomerActionApprovedInput {
    orderId: string;
  
    fulfillmentId?:
      string | null;
  
    submissionId: string;
  }
  
  
  interface NotifyCustomerActionRejectedInput {
    orderId: string;
  
    fulfillmentId?:
      string | null;
  
    submissionId: string;
  
    reason: string;
  }
  
  
  export async function notifyCustomerActionApproved(
    input:
      NotifyCustomerActionApprovedInput
  ) {
    return createOrderNotification({
      orderId:
        input.orderId,
  
      fulfillmentId:
        input.fulfillmentId ??
        null,
  
      type:
        "customer_correction_approved",
  
      title:
        "资料修正已确认",
  
      message:
        "您重新提交的资料已经审核通过，订单将继续办理。您可以在订单页面查看最新进度。",
  
      idempotencyKey:
        `customer_correction_approved:${input.submissionId}`,
  
      metadata: {
        submissionId:
          input.submissionId,
      },
    });
  }
  
  
  export async function notifyCustomerActionRejected(
    input:
      NotifyCustomerActionRejectedInput
  ) {
    const reason =
      input.reason.trim();
  
  
    return createOrderNotification({
      orderId:
        input.orderId,
  
      fulfillmentId:
        input.fulfillmentId ??
        null,
  
      type:
        "customer_correction_rejected",
  
      title:
        "资料仍需要修改",
  
      message:
        reason
          ? `您重新提交的资料仍需要修改。原因：${reason} 请进入订单页面重新填写。`
          : "您重新提交的资料仍需要修改，请进入订单页面查看并重新填写。",
  
      idempotencyKey:
        `customer_correction_rejected:${input.submissionId}`,
  
      metadata: {
        submissionId:
          input.submissionId,
  
        reason:
          reason ||
          null,
      },
    });
  }