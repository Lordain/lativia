import type {
    FulfillmentActivity,
  } from "@/types/fulfillment";
  
  import type {
    OrderTimelineItem,
  } from "@/types/orderTimeline";
  
  interface PaymentTransactionLike {
    id: string;
  
    provider:
      string;
  
    status:
      string;
  
    amount:
      number | string | null;
  
    currency:
      string | null;
  
    created_at:
      string;
  }
  
  interface PaymentAuditLike {
    id: string;
  
    action:
      string;
  
    message?:
      string | null;
  
    created_at:
      string;
  
    metadata?:
      Record<
        string,
        unknown
      > | null;
  }
  
  function getFulfillmentTitle(
    activity:
      FulfillmentActivity
  ) {
    if (
      activity.action ===
      "fulfillment_created"
    ) {
      return "办理任务已建立";
    }
  
    if (
      activity.action ===
      "note_added"
    ) {
      return "管理员内部备注";
    }

    if (
      activity.action ===
      "customer_correction_submitted"
    ) {
      return "客户已提交修正资料";
    }
    
    if (
      activity.action ===
      "customer_correction_rejected"
    ) {
      return "客户修正资料审核未通过";
    }
    
    if (
      activity.action ===
      "customer_correction_approved"
    ) {
      return "客户修正资料审核通过";
    }
  
    if (
      activity.action ===
      "status_changed"
    ) {
      if (
        activity.toStatus ===
        "completed"
      ) {
        return "服务已完成";
      }
  
      if (
        activity.toStatus ===
        "failed"
      ) {
        return "服务无法完成";
      }
  
      if (
        activity.toStatus ===
        "refund_review"
      ) {
        return "进入退款审核";
      }
  
      if (
        activity.toStatus ===
        "waiting_human"
      ) {
        return "进入人工处理";
      }
  
      if (
        activity.toStatus ===
        "waiting_customer"
      ) {
        return "等待客户补充资料";
      }
  
      if (
        activity.toStatus ===
        "processing"
      ) {
        return "继续办理";
      }
  
      if (
        activity.toStatus ===
        "validating"
      ) {
        return "开始资料检查";
      }
    }
  
    return "办理记录";
  }
  
  function getFulfillmentLevel(
    activity:
      FulfillmentActivity
  ): OrderTimelineItem["level"] {

    if (
      activity.action ===
      "customer_correction_approved"
    ) {
      return "success";
    }
    
    if (
      activity.action ===
      "customer_correction_rejected"
    ) {
      return "warning";
    }
    
    if (
      activity.action ===
      "customer_correction_submitted"
    ) {
      return "info";
    }


    if (
      activity.toStatus ===
      "completed"
    ) {
      return "success";
    }
  
    if (
      activity.toStatus ===
        "failed" ||
      activity.toStatus ===
        "refund_review"
    ) {
      return "error";
    }
  
    if (
      activity.toStatus ===
        "waiting_human" ||
      activity.toStatus ===
        "waiting_customer" ||
      activity.toStatus ===
        "manual_review"
    ) {
      return "warning";
    }
  
    return "info";
  }
  
  export function buildAdminOrderTimeline({
    transactions,
    auditLogs,
    fulfillmentActivity,
  }: {
    transactions:
      PaymentTransactionLike[];
  
    auditLogs:
      PaymentAuditLike[];
  
    fulfillmentActivity:
      FulfillmentActivity[];
  }): OrderTimelineItem[] {
    const paymentItems:
      OrderTimelineItem[] =
      transactions.map(
        (
          transaction
        ) => ({
          id:
            `payment-${transaction.id}`,
  
          source:
            "payment",
  
          level:
            transaction.status ===
            "paid"
              ? "success"
              : transaction.status ===
                  "failed"
                ? "error"
                : "info",
  
          title:
            transaction.status ===
            "paid"
              ? "付款已确认"
              : "付款状态更新",
  
          description:
            transaction.amount !==
              null &&
            transaction.currency
              ? `${transaction.provider} · ${transaction.currency} ${Number(
                  transaction.amount
                ).toFixed(2)}`
              : transaction.provider,
  
          actor:
            "支付系统",
  
          createdAt:
            transaction.created_at,
  
          metadata: {
            provider:
              transaction.provider,
  
            status:
              transaction.status,
          },
        })
      );
  
    const auditItems:
      OrderTimelineItem[] =
      auditLogs.map(
        (
          log
        ) => ({
          id:
            `payment-audit-${log.id}`,
  
          source:
            "payment_audit",
  
          level:
            "info",
  
          title:
            `支付记录：${log.action}`,
  
          description:
            log.message ??
            null,
  
          actor:
            "系统",
  
          createdAt:
            log.created_at,
  
          metadata:
            log.metadata ??
            {},
        })
      );
  
    const fulfillmentItems:
      OrderTimelineItem[] =
      fulfillmentActivity.map(
        (
          item
        ) => ({
          id:
            `fulfillment-${item.id}`,
  
          source:
            "fulfillment",
  
          level:
            getFulfillmentLevel(
              item
            ),
  
          title:
            getFulfillmentTitle(
              item
            ),
  
          description:
            item.message,
  
          actor:
            item.actorType ===
            "admin"
              ? "管理员"
              : item.actorType ===
                  "customer"
                ? "客户"
                : "系统",
  
          createdAt:
            item.createdAt,
  
          metadata: {
            fromStatus:
              item.fromStatus,
  
            toStatus:
              item.toStatus,
  
            ...item.metadata,
          },
        })
      );
  
    return [
      ...paymentItems,
      ...auditItems,
      ...fulfillmentItems,
    ].sort(
      (
        a,
        b
      ) =>
        new Date(
          a.createdAt
        ).getTime() -
        new Date(
          b.createdAt
        ).getTime()
    );
  }