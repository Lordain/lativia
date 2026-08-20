import {
    createOrderNotification,
  } from "@/lib/notifications/createOrderNotification";
  
  
  interface NotifyOrderResultDeliveredInput {
    orderId:
      string;
  
    resultId:
      string;
  
    resultIsOfficial:
      boolean;
  }
  
  
  export async function notifyOrderResultDelivered(
    input:
      NotifyOrderResultDeliveredInput
  ) {
    return createOrderNotification({
      orderId:
        input.orderId,
  
      type:
        "result_delivered",
  
      title:
        "服务结果已交付",
  
      message:
        input.resultIsOfficial
          ? "您的服务结果已经完成交付。请进入订单页面的服务空间查看已交付的官方结果。"
          : "您的服务结果已经完成交付。请进入订单页面的服务空间查看详细内容。",
  
      idempotencyKey:
        `result_delivered:${input.resultId}`,
  
      metadata: {
        resultId:
          input.resultId,
  
        resultIsOfficial:
          input.resultIsOfficial,
      },
    });
  }